# Nimiq Feedback Widget

A customizable feedback widget for Vue 3 applications that allows users to submit bug reports, ideas, and general feedback.

## Quick Start

### 1. Import the JavaScript and CSS (not recommended for production)

Add the widget script to your HTML:

```html
<script src="https://nq-feedback.maximogarciamtnez.workers.dev/widget.js" defer></script>
```

Add the widget styles to your HTML:

```html
<link rel="stylesheet" href="https://nq-feedback.maximogarciamtnez.workers.dev/widget.css" />
```

### 2. Deferred Loading (Recommended)

For better performance, load both CSS and JS with deferred loading:

```html
<!-- Preload for better performance -->
<link
  rel="preload"
  href="https://nq-feedback.maximogarciamtnez.workers.dev/widget.css"
  as="style"
  onload="this.onload=null;this.rel='stylesheet'"
/>
<noscript><link rel="stylesheet" href="https://nq-feedback.maximogarciamtnez.workers.dev/widget.css" /></noscript>

<!-- Load JavaScript deferred -->
<script src="https://nq-feedback.maximogarciamtnez.workers.dev/widget.js" defer></script>
```

### 3. Mount the Widget

Mount the widget to any DOM element:

```html
<div id="feedback-widget"></div>

<script>
  document.addEventListener('DOMContentLoaded', () => {
    const widget = window.mountFeedbackWidget('#feedback-widget', {
      app: 'nimiq-wallet', // 'nimiq-wallet' | 'nimiq-pay' | 'playground'
      lang: 'en', // 'en' | 'es' (optional, defaults to 'en')
      feedbackEndpoint: 'https://nq-feedback.maximogarciamtnez.workers.dev/api/feedback',
      dev: true, // boolean (optional, defaults to false) - marks submissions as development
      initialForm: 'bug', // optional - directly show a specific form: 'bug' | 'idea' | 'feedback'
    })

    // Use widget methods
    widget.showFormGrid() // Show the form selection grid
    // widget.showForm('bug'); // Show specific form: 'bug' | 'idea' | 'feedback'
    // widget.closeWidget(); // Close the widget
    // widget.goBack(); // Go back to form grid
    // widget.destroy(); // Cleanup and unmount
  })
</script>
```

### 4. TypeScript Support

Add these type declarations to your Vue 3 project (e.g., in `env.d.ts` or `types.d.ts`):

```typescript
// widget.types.d.ts

export type FormType = 'bug' | 'idea' | 'feedback'

export interface WidgetProps {
  app: string
  lang?: string
  feedbackEndpoint?: string
  dev?: boolean
  initialForm?: FormType
}

export interface WidgetEvents {
  'form-selected': FormType
  'go-back': void
  'form-submitted': { success: true, data: any }
  'form-error': { success: false, error: string, details?: any }
  'before-submit': { formData: FormData, type: FormType, app: string }
}

export interface WidgetInstance {
  showFormGrid: () => void
  showForm: (type: FormType) => void
  closeWidget: () => void
  goBack: () => void
  destroy: () => void
  communication?: {
    on: <K extends keyof WidgetEvents>(event: K, callback: (data: WidgetEvents[K]) => void) => void
    off: <K extends keyof WidgetEvents>(event: K, callback?: (data: WidgetEvents[K]) => void) => void
    emit: <K extends keyof WidgetEvents>(event: K, data: WidgetEvents[K]) => void
  }
}

declare global {
  interface Window {
    mountFeedbackWidget: MountFeedbackWidgetFn
  }
}

export type MountFeedbackWidgetFn = (selector: string, props?: WidgetProps) => WidgetInstance

export {}
```

> Make sure to include the type declarations in your TypeScript configuration so they are recognized globally.

## Advanced Usage

### Event Handling

Listen to widget events using the communication API:

```typescript
const widget = window.mountFeedbackWidget('#feedback-widget', {
  app: 'nimiq-wallet'
})

// Listen to events
widget.communication?.on('form-selected', (formType) => {
  console.log('Form selected:', formType)
})

widget.communication?.on('form-submitted', (data) => {
  console.log('Form submitted successfully:', data)
})

widget.communication?.on('form-error', (error) => {
  console.error('Form submission error:', error)
})

widget.communication?.on('before-submit', ({ formData, type, app }) => {
  console.log('Before form submission:', { type, app })
  // You can modify formData here to add additional data like debug logs
  formData.append('debugInfo', JSON.stringify({ userAgent: navigator.userAgent }))
})
```

### Programmatic Control

```typescript
// Show specific form directly
widget.showForm('bug')

// Show form selection grid
widget.showFormGrid()

// Close the widget
widget.closeWidget()

// Navigate back to form grid
widget.goBack()

// Clean up when done
widget.destroy()
```

### Theming

The widget automatically adapts to the user's preferred color scheme (light/dark mode). In dark mode, the widget will use lighter colors for text and darker colors for input elements. This behavior is controlled by the `color-scheme` CSS property.

You can override the color scheme for a specific instance of the widget by setting the `color-scheme` CSS property on the widget's container:

```css
#feedback-widget {
  color-scheme: light; /* Force light mode */
  /* or */
  color-scheme: dark; /* Force dark mode */
}
```

By default, the widget will respect the user's system preferences and switch automatically between light and dark mode.
