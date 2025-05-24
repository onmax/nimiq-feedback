# Widget Documentation

Welcome to the widget documentation. Here you'll find how to integrate and use our feedback widget.

## Mounting the Widget

To mount the widget, you need to include our script and then call the initialization function.

```html
<script src="<YOUR_WIDGET_SCRIPT_URL>"></script>
<script>
  // Initialize the widget
  // Example: NimiqFeedbackWidget.init({ option: 'value' });
</script>
```

## Passing Properties

You can pass properties to the widget during initialization. For example, to set the language:

```javascript
NimiqFeedbackWidget.init({
  language: 'es' // 'en' for English, 'es' for Spanish
});
```

Available properties:
*   `language`: (String) Sets the language of the widget. Supported: 'en', 'es'.

## Destroying the Widget

To remove the widget from the page:

```javascript
// Example: NimiqFeedbackWidget.destroy();
```

Make sure to replace placeholder comments and URLs with actual information if available, or leave them as illustrative examples.
