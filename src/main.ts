import * as fs from 'fs-extra';
import path from 'path';
import mime from 'mime-types';
import pdfkit from 'pdfkit';
import svg2PDF from 'svg-to-pdfkit'


// import svg2img, { Format } from 'svg2img'

const project_root = path.resolve(__dirname, '../resource/canvas-editor/docs');
const output_sources_root = path.resolve(__dirname, '../output');

; (async () => {


    const fileList = await deepMap_projectFiles(project_root)

    await gen_pdf(output_sources_root, fileList)


})();


async function gen_pdf(outputPath: string, fileList: File[]) {
    const doc = new pdfkit({
        autoFirstPage: false,
        bufferPages: true,
        compress: false,
        pdfVersion: '1.3',
    });


    // const fontBuff = await fs.readFile()



    //指定微软雅黑字体 格式不匹配
    // doc.font(path.resolve(__dirname, './assets/fonts/msyh.ttf'), 'msyh')
    doc.font(path.join(__dirname, './assets/fonts/SourceHanSansCN/SourceHanSansCN-Normal.ttf'))//指定思源黑体

    for (const file of fileList) {

        const filePathArr = file.path.split('\\')
        const projectRootIndex = filePathArr.findIndex(item => item === 'canvas-editor')
        const retFilePath = filePathArr.filter((_, index) => index >= projectRootIndex).join('/')

        const page = doc
            .addPage()
            .text(`File Path: ${retFilePath}\n`)


        if (file.type === 'text') {
            const txt = await fs.readFile(file.path, 'utf-8');

            // // 生成SVG字符串
            // const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="400"><text x="50" y="50" font-size="16" fill="black">${content}</text></svg>`;
            // // @ts-ignore
            // svg2img(svgString, { format: 'png' }, (error, buffer) => {
            //     if (error) {
            //         console.error('转换为图片时出错:', error);
            //         return;
            //     }
            //     page.image(buffer);
            //     console.log('图片已生成');
            // });

            // // 文本文件,获取内容
            page.text(txt)
        } else if (file.type === 'asset') {

            if (file.name.endsWith('.svg')) {

                const svgBuffer = await fs.readFile(file.path)

                svg2PDF(page, svgBuffer.toString())

            } else {
                // 资源文件,插入图片
                page.image(file.path);
            }

        } else {
            // 未知类型文件,输出文件名
            page.text(file.name)
        }

    }



    doc.end();
    doc.pipe(fs.createWriteStream(`${outputPath}/project.pdf`));

}


// 文件信息
interface File {
    name: string;
    path: string;
    type: 'text' | 'asset' | 'unknown';
}


/**
 * @param rootPath
 */
async function deepMap_projectFiles(rootPath: string) {


    const files: File[] = [];

    async function traverse(dir: string) {
        const dirFiles = await fs.readdir(dir);

        for (const file of dirFiles) {
            const filePath = path.join(dir, file);

            const stat = await fs.stat(filePath)
            const isDir = stat.isDirectory()

            if (isDir) {
                // 忽略.git目录
                if (file === '.git' || file === '.vitepress') { continue; }
                await traverse(filePath)
            } else {
                files.push({
                    name: file,
                    path: filePath,
                    type: getFileType(file),
                });
            }

        }

    }

    await traverse(rootPath)

    return files.filter(item => item.type !== 'unknown')
}


function getFileType(fileName: string) {

    const mimeType = mime.lookup(fileName);

    if (fileName.startsWith('.') || fileName.endsWith('.ts')) {
        return 'text'
    }

    if (!mimeType) {
        return 'unknown'
    } else if (mimeType.startsWith('image')) {
        return 'asset'
    } else if (mimeType.startsWith('text')) {
        return 'text'
    }

    return 'unknown'
}