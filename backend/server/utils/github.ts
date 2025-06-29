import type { RestEndpointMethodTypes } from '@octokit/rest'
import type { InferOutput } from 'valibot'
import type { FormSchema } from './valibot-schemas'
import { Octokit } from '@octokit/rest'
import { ratingToEmoji } from './rating-to-emoji'

export interface CreateGitHubIssueOptions {
  form: InferOutput<typeof FormSchema>
  markdown: string
}

type Issue = RestEndpointMethodTypes['issues']['create']['parameters']

type CreateGitHubResult = Result<GitHubIssue>

export async function createGitHubIssue({ markdown: body, form: { app, type, rating, tags } }: CreateGitHubIssueOptions): CreateGitHubResult {
  const { token, owner, repo } = useRuntimeConfig().github

  const title = `[${app}] - ${{ feedback: 'Feedback', bug: 'Bug report', idea: 'Idea' }[type]}`
  const labels = [`app/${app}`, `kind/${type}`]
  if (type === 'feedback')
    labels.push(ratingToEmoji(rating))
  if (tags && tags.length > 0)
    labels.push(...tags)
  const issueParams: Issue = { title, body, owner, repo, labels }

  const octokit = new Octokit({ auth: token })
  const response = await octokit.issues.create(issueParams)
  if (response.status !== 201)
    return [false, 'Error creating issue on GitHub', undefined]

  return [true, undefined, { issueUrl: response.data.html_url }]
}
