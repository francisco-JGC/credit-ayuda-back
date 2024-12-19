import { readdirSync, statSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

function addJsExtensionToImports(dir) {
  try {
    const files = readdirSync(dir)

    files.forEach((file) => {
      const fullPath = join(dir, file)

      try {
        if (statSync(fullPath).isDirectory()) {
          addJsExtensionToImports(fullPath)
        } else if (file.endsWith('.js')) {
          let content = readFileSync(fullPath, 'utf-8')

          const updatedContent = content.replace(
            /from\s+['"](\.{1,2}\/[^'"]+?)['"]/g,
            (match, importPath) =>
              importPath.endsWith('.js') ? match : `from '${importPath}.js'`
          )

          if (content !== updatedContent) {
            writeFileSync(fullPath, updatedContent, 'utf-8')
            console.log(`Updated imports in file: ${fullPath}`)
          }
        }
      } catch (error) {
        console.error(`Error processing file: ${fullPath}`, error.message)
      }
    })
  } catch (error) {
    console.error(`Error reading directory: ${dir}`, error.message)
  }
}

addJsExtensionToImports('./build')
