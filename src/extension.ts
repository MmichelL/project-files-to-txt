import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
  // Registrar el comando "Export Project to TXT"
  const disposable = vscode.commands.registerCommand('extension.exportProjectToTxt', async () => {
    // 1) Verificar que exista una carpeta abierta en el workspace
    const rootPath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
    if (!rootPath) {
      vscode.window.showErrorMessage('No hay un proyecto abierto en el espacio de trabajo.');
      return;
    }

    // 2) Leer la configuración "projectFilesToTxt.exclude" definida en package.json
    const config = vscode.workspace.getConfiguration('projectFilesToTxt');
    const exclusions = config.get<string[]>('exclude') || [];

    // 3) Definir el archivo de salida
    const outputFile = path.join(rootPath, 'project-contents.txt');

    // 4) Crear el contenido (en memoria)
    const fileContent = generateExportFile(rootPath, exclusions);

    // 5) Guardar en el archivo
    fs.writeFileSync(outputFile, fileContent, 'utf8');

    // 6) Notificar al usuario
    vscode.window.showInformationMessage(`Archivo exportado a: ${outputFile}`);
  });

  // Suscribir el comando
  context.subscriptions.push(disposable);
}

function generateExportFile(rootPath: string, exclusions: string[]): string {
  // Secciones principales del TXT
  let guide = '';
  let structure = '';
  let contents = '';

  // 1) Guía rápida al principio
  guide += `# Guía Rápida\n`;
  guide += `Este archivo está estructurado en **Markdown** para permitir una fácil lectura.\n`;
  guide += `- **Sección "Estructura de Archivos"**: Muestra el árbol de archivos que se han incluido.\n`;
  guide += `- **Sección "Contenido de los Archivos"**: Muestra el contenido real de cada archivo.\n`;
  guide += `\n---\n`;

  // 2) Construir la lista de archivos y su contenido
  //    Para esto, primero obtendremos una lista de rutas a incluir
  const filePaths: string[] = [];
  const dirPaths: string[] = [];

  // Recorremos la carpeta raíz recursivamente
  (function walkDirectory(currentPath: string) {
    const entries = fs.readdirSync(currentPath, { withFileTypes: true });
    for (const entry of entries) {
      const entryPath = path.join(currentPath, entry.name);
      const relativePath = path.relative(rootPath, entryPath);

      // Si la ruta contiene algún patrón de exclusión, la saltamos
      if (shouldExclude(relativePath, exclusions)) {
        continue;
      }

      if (entry.isDirectory()) {
        dirPaths.push(relativePath);
        walkDirectory(entryPath);
      } else {
        filePaths.push(relativePath);
      }
    }
  })(rootPath);

  // 2.1) Construir la sección de Estructura
  structure += `# Estructura de Archivos\n`;

  // Agregar carpetas primero (opcionalmente) y luego archivos
  // Se puede "simular" un árbol, aunque sea simple
  dirPaths.forEach(dir => {
    structure += `- **(Carpeta)** ${dir}\n`;
  });
  filePaths.forEach(file => {
    structure += `- **(Archivo)** ${file}\n`;
  });

  // 2.2) Construir la sección de Contenidos
  contents += `\n---\n# Contenido de los Archivos\n`;
  filePaths.forEach(file => {
    const absoluteFilePath = path.join(rootPath, file);
    const fileData = fs.readFileSync(absoluteFilePath, 'utf8');
    contents += `\n## ${file}\n`;
    contents += `\`\`\`\n${fileData}\n\`\`\`\n`; 
    // Usamos triple backtick para mostrarlo como "código"
  });

  // 3) Unir todo en un solo string
  return `${guide}${structure}${contents}`;
}

/**
 * Determina si una ruta debe ser excluida con base en la configuración.
 * Por ejemplo, si `exclude` contiene "node_modules", cualquier path que contenga "node_modules" será excluido.
 */
function shouldExclude(relativePath: string, excludes: string[]): boolean {
  return excludes.some(ex => relativePath.includes(ex));
}

export function deactivate() {}
