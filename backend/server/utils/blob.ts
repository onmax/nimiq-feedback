import type { InferOutput } from 'valibot'
import consola from 'consola'

export async function uploadFiles(id: string, { app, type, attachments }: InferOutput<typeof FormSchema>): Result<string[]> {
  const { productionUrl } = useRuntimeConfig()
  let imagesUrl: URL
  try {
    imagesUrl = new URL('/images/', productionUrl)
  }
  catch (error) {
    consola.error(`Error uploading files: ${JSON.stringify(error)}. To ${productionUrl} - images/`)
    throw createError({
      statusCode: 500,
      statusMessage: `Error uploading files: ${JSON.stringify(error)}. To ${productionUrl} - images/`,
    })
  }

  const filesUrls: string[] = []
  const promises = attachments.map(async (file) => {
    const name = encodeURI(`${app}/${type}/${id}__${file.name}`)
    const hubFile = await hubBlob().put(name, file)
    try {
      filesUrls.push(new URL(`./${hubFile.pathname}`, imagesUrl).toString())
    }
    catch (error) {
      consola.error(`Error uploading file: ${name} to ${hubFile.pathname} - ${imagesUrl}: ${JSON.stringify(error)}`)
      throw createError({
        statusCode: 500,
        statusMessage: `Error uploading file: ${name} to ${hubFile.pathname} - ${imagesUrl}: ${JSON.stringify(error)}`,
      })
    }
  })

  const results = await Promise.allSettled(promises)
  const errors = results.filter(result => result.status === 'rejected')
  if (errors.length > 0)
    return [false, JSON.stringify(errors), undefined] as const

  return [true, undefined, filesUrls] as const
}

export async function uploadLogs(id: string, { app, logs }: InferOutput<typeof FormSchema>): Result<string | undefined> {
  if (!logs)
    return [true, undefined, undefined] as const

  const { productionUrl } = useRuntimeConfig()

  let logsUrl: URL
  try {
    logsUrl = new URL('/logs/', productionUrl)
  }
  catch (error) {
    consola.error(`Error uploading logs: ${JSON.stringify(error)}. To ${productionUrl} - logs/`)
    throw createError({
      statusCode: 500,
      statusMessage: `Error uploading logs: ${JSON.stringify(error)}. To ${productionUrl} - logs/`,
    })
  }

  try {
    const name = encodeURI(`${app}/logs/${id}.txt`)
    const logBlob = new Blob([logs], { type: 'text/plain' })
    const hubFile = await hubBlob().put(name, logBlob)

    let logUrl
    try {
      logUrl = new URL(`./${hubFile.pathname}`, logsUrl).toString()
    }
    catch (error) {
      consola.error(`Error uploading log: ${name} to ${hubFile.pathname} - ${logsUrl}: ${JSON.stringify(error)}`)
      throw createError({
        statusCode: 500,
        statusMessage: `Error uploading log: ${name} to ${hubFile.pathname} - ${logsUrl}: ${JSON.stringify(error)}`,
      })
    }

    return [true, undefined, logUrl] as const
  }
  catch (error) {
    return [false, `Error uploading logs: ${JSON.stringify(error)}`, undefined] as const
  }
}
