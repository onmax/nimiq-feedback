import type { LocaleMessages } from './types'

export default {
  attachmentUploader: {
    previewAlt: 'Vista previa',
    deleteImageLabel: 'Eliminar imagen',
    uploadHere: 'Subir aquí',
    anyImageFormat: 'Cualquier formato de imagen',
    title: 'Adjuntos',
  },
  bugForm: {
    descriptionPlaceholder: 'Por favor, cuéntanos cómo podemos mejorar tu experiencia con Nimiq*',
    descriptionDefaultValue: '¡Esto es una prueba, genial!',
    emailLabel: 'Correo electrónico',
    emailPlaceholder: 'Si necesitamos más información*',
    shareDebugInfoLabel: 'Incluir detalles técnicos para ayudarnos a solucionar este problema más rápido',
  },
  feedbackForm: {
    descriptionPlaceholder: 'Por favor, cuéntanos cómo podemos mejorar tu experiencia con Nimiq*',
  },
  feedbackWidget: {
    title: 'Envía tu opinión',
    bugReportButton: 'Reportar error',
    ideaButton: 'Comparte tu idea',
    feedbackButton: 'Comentarios',
    termsAndConditionsApply: 'Términos y condiciones aplican',
  },
  formContainer: {
    titleBug: 'Reportar un error',
    titleIdea: 'Comparte tu idea',
    titleFeedback: 'Dar comentarios',
    successMessage: '¡Envío exitoso! Por favor espera...',
    errorPrefix: 'Error:',
    errorDetailsSummary: 'Detalles',
    sendingButton: 'Enviando...',
    submitButtonDefault: 'Enviar comentarios',
    learnMore: 'Más información',
    privacyPolicyText: 'sobre cómo manejamos tus datos.',
  },
  ideaForm: {
    descriptionPlaceholder: 'Por favor, cuéntanos cómo podemos mejorar tu experiencia con Nimiq*',
    exampleHint: 'Por ejemplo, una captura de pantalla de una función de otra aplicación',
  },
} satisfies LocaleMessages
