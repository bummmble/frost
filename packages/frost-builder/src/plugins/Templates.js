import HtmlWebpackPlugin from 'html-webpack-plugin';

export default function createTemplates(templates) {
  if (!templates || templates.length === 0) {
    throw new Error(
      `If running in 'static' mode the templates array must be populated by htmlWebpackPlugin config options`
    );
  }

  const plugins = [];
  templates.forEach(template => {
    if (typeof template !== 'object') {
      throw new Error(
        'Templates passed to the array of templates in config need to be valid HtmlWebpackPlugin config object'
      );
    }
    plugins.push(new HtmlWebpackPlugin(template));
  });
  return plugins;
}
