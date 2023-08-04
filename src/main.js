"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs-extra");
var path_1 = require("path");
var mime_types_1 = require("mime-types");
var pdfkit_1 = require("pdfkit");
var svg_to_pdfkit_1 = require("svg-to-pdfkit");
var svg2img_1 = require("svg2img");
var project_root = path_1.default.resolve(__dirname, '../resource/canvas-editor-types');
var output_sources_root = path_1.default.resolve(__dirname, '../output');
;
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var fileList;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, deepMap_projectFiles(project_root)];
            case 1:
                fileList = _a.sent();
                return [4 /*yield*/, gen_pdf(output_sources_root, fileList)];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); })();
function gen_pdf(outputPath, fileList) {
    return __awaiter(this, void 0, void 0, function () {
        var doc, _loop_1, _i, fileList_1, file;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    doc = new pdfkit_1.default({
                        autoFirstPage: false,
                        bufferPages: true,
                        compress: false,
                        pdfVersion: '1.3',
                    });
                    _loop_1 = function (file) {
                        var filePathArr, projectRootIndex, retFilePath, page, content, svgString, svgBuffer;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    filePathArr = file.path.split('\\');
                                    projectRootIndex = filePathArr.findIndex(function (item) { return item === 'canvas-editor-types'; });
                                    retFilePath = filePathArr.filter(function (_, index) { return index >= projectRootIndex; }).join('/');
                                    page = doc
                                        .addPage()
                                        .text("File Path: ".concat(retFilePath, "\n"));
                                    if (!(file.type === 'text')) return [3 /*break*/, 2];
                                    return [4 /*yield*/, fs.readFile(file.path, 'utf-8')];
                                case 1:
                                    content = _b.sent();
                                    svgString = "<svg xmlns=\"http://www.w3.org/2000/svg\" version=\"1.1\"  width=\"800\" height=\"400\"><text x=\"50\" y=\"50\" font-size=\"16\" fill=\"black\">".concat(content, "</text></svg>");
                                    (0, svg2img_1.default)(svgString, { format: svg2img_1.Format.png }, function (error, buffer) {
                                        if (error) {
                                            console.error('转换为图片时出错:', error);
                                            return;
                                        }
                                        page.image(buffer);
                                        console.log('图片已生成');
                                    });
                                    return [3 /*break*/, 7];
                                case 2:
                                    if (!(file.type === 'asset')) return [3 /*break*/, 6];
                                    if (!file.name.endsWith('.svg')) return [3 /*break*/, 4];
                                    return [4 /*yield*/, fs.readFile(file.path)];
                                case 3:
                                    svgBuffer = _b.sent();
                                    (0, svg_to_pdfkit_1.default)(page, svgBuffer.toString());
                                    return [3 /*break*/, 5];
                                case 4:
                                    // 资源文件,插入图片
                                    page.image(file.path);
                                    _b.label = 5;
                                case 5: return [3 /*break*/, 7];
                                case 6:
                                    // 未知类型文件,输出文件名
                                    page.text(file.name);
                                    _b.label = 7;
                                case 7: return [2 /*return*/];
                            }
                        });
                    };
                    _i = 0, fileList_1 = fileList;
                    _a.label = 1;
                case 1:
                    if (!(_i < fileList_1.length)) return [3 /*break*/, 4];
                    file = fileList_1[_i];
                    return [5 /*yield**/, _loop_1(file)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    doc.end();
                    doc.pipe(fs.createWriteStream("".concat(outputPath, "/project.pdf")));
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * @param rootPath
 */
function deepMap_projectFiles(rootPath) {
    return __awaiter(this, void 0, void 0, function () {
        function traverse(dir) {
            return __awaiter(this, void 0, void 0, function () {
                var dirFiles, _i, dirFiles_1, file, filePath, stat, isDir;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, fs.readdir(dir)];
                        case 1:
                            dirFiles = _a.sent();
                            _i = 0, dirFiles_1 = dirFiles;
                            _a.label = 2;
                        case 2:
                            if (!(_i < dirFiles_1.length)) return [3 /*break*/, 7];
                            file = dirFiles_1[_i];
                            filePath = path_1.default.join(dir, file);
                            return [4 /*yield*/, fs.stat(filePath)];
                        case 3:
                            stat = _a.sent();
                            isDir = stat.isDirectory();
                            if (!isDir) return [3 /*break*/, 5];
                            // 忽略.git目录
                            if (file === '.git' || file === '.vitepress') {
                                return [3 /*break*/, 6];
                            }
                            return [4 /*yield*/, traverse(filePath)];
                        case 4:
                            _a.sent();
                            return [3 /*break*/, 6];
                        case 5:
                            files.push({
                                name: file,
                                path: filePath,
                                type: getFileType(file),
                            });
                            _a.label = 6;
                        case 6:
                            _i++;
                            return [3 /*break*/, 2];
                        case 7: return [2 /*return*/];
                    }
                });
            });
        }
        var files;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    files = [];
                    return [4 /*yield*/, traverse(rootPath)];
                case 1:
                    _a.sent();
                    return [2 /*return*/, files.filter(function (item) { return item.type !== 'unknown'; })];
            }
        });
    });
}
function getFileType(fileName) {
    var mimeType = mime_types_1.default.lookup(fileName);
    if (fileName.startsWith('.') || fileName.endsWith('.ts')) {
        return 'text';
    }
    if (!mimeType) {
        return 'unknown';
    }
    else if (mimeType.startsWith('image')) {
        return 'asset';
    }
    else if (mimeType.startsWith('text')) {
        return 'text';
    }
    return 'unknown';
}
