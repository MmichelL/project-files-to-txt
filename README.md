# Project Files to TXT

¡Bienvenido(a) a **Project Files to TXT**! Esta extensión te permite **exportar todo el contenido** de los archivos de tu proyecto a un **solo archivo .txt**, con una estructura clara, y la posibilidad de **excluir** archivos y carpetas que no quieras incluir. 

## Características principales

1. **Exportar todo en un solo TXT**  
   Genera un archivo `project-contents.txt` en la raíz del proyecto, que contiene:
   - Una **guía rápida** de cómo está organizado el `.txt`.  
   - Una **lista de carpetas y archivos** (estructura del proyecto).  
   - El **contenido real** de cada archivo en formato Markdown (`\`\`\``).

2. **Configuración de exclusión**  
   Mediante la propiedad `projectFilesToTxt.exclude` (definida en las configuraciones de usuario de VS Code), puedes especificar **carpetas y/o archivos** que no se incluirán en el archivo final.  
   - Por defecto se excluyen: `node_modules`, `build`, `.git`, `.vscode`.

3. **Fácil de usar**  
   Solo necesitas ejecutar el comando `Export Project to TXT` desde la Paleta de Comandos (`Ctrl+Shift+P` o `Cmd+Shift+P` en macOS).

## Requisitos

- No se necesitan dependencias especiales: la extensión usa la API interna de VS Code para leer y escribir archivos.
- Asegúrate de **tener un proyecto abierto** en tu espacio de trabajo de VS Code.

## Uso de la extensión

1. **Instala** la extensión (ya sea en modo desarrollador o desde un .vsix, si no está publicada en el Marketplace).
2. Abre un proyecto en VS Code.
3. Presiona `Ctrl+Shift+P` (Windows/Linux) o `Cmd+Shift+P` (macOS) para abrir la **Paleta de Comandos**.
4. Escribe **`Export Project to TXT`** y presiona **Enter**.
5. Se generará el archivo `project-contents.txt` en la raíz del proyecto con la **estructura y contenido** de cada archivo.

## Configuración de la extensión

Esta extensión contribuye con la siguiente configuración:

- **`projectFilesToTxt.exclude`**  
  Array de strings que especifica rutas o nombres de archivos/carpetas a excluir.  
  Por defecto:  
  ```json
  [
    "node_modules",
    "build",
    ".git",
    ".vscode",
    "package-lock.json"
  ]
