export interface Position {
    x: number;
    y: number;
}

export interface Style {
    fillStyle?: string;
    strokeStyle?: string;
    lineWidth?: number;
    font?: string;
    fontSize?: string;
    textAlign?: "start" | "end" | "left" | "right" | "center";
    textBaseline?:
    | "top"
    | "hanging"
    | "middle"
    | "alphabetic"
    | "ideographic"
    | "bottom";
}

interface CompWindow extends Window {
    backingStorePixelRatio?: number
    webkitBackingStorePixelRatio?: number
    mozBackingStorePixelRatio?: number
    msBackingStorePixelRatio?: number
    oBackingStorePixelRatio?: number
}


/**
 * HTML Canvas API 封装
 */
export class Canvas {
    private $el: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private pixelRatio: number;

    constructor(
        readonly width: number,
        readonly height: number,
        container?: HTMLElement,
        pixelRatio?: number,
    ) {
        this.$el = document.createElement("canvas");
        this.pixelRatio = pixelRatio || this.getPixelRatio(window)
        this.$el.width = width * this.pixelRatio;
        this.$el.height = height * this.pixelRatio;
        this.$el.style.width = `${width}px`;
        this.$el.style.height = `${height}px`;
        // 是否传入父容器，嵌入到父容器中
        container ? container.appendChild(this.$el) : null;
        this.ctx = this.$el.getContext("2d") as CanvasRenderingContext2D;
    }

    private convertPoint(position: Position): Position {
        return {
            x: position.x * this.pixelRatio,
            y: (this.height - position.y) * this.pixelRatio
        };

    }

    private convertPixel(n: number): number {
        return n * this.pixelRatio;
    }

    private applyStyle(style?: Style) {
        this.ctx.save();
        if (style) {

            if (style.fillStyle) {
                this.ctx.fillStyle = style.fillStyle;
            }
            if (style.lineWidth) {
                this.ctx.lineWidth = style.lineWidth;
            }
            if (style.strokeStyle) {
                this.ctx.strokeStyle = style.strokeStyle
            }
            if (style.font) {
                this.ctx.font = style.font;
            }
            if (style.textAlign) {
                this.ctx.textAlign = style.textAlign;
            }
            if (style.textBaseline) {
                this.ctx.textBaseline = style.textBaseline;
            }
        }
    }

    private resetStyle() {
        this.ctx.restore();
    }

    /**
     * 清除画布
     * @param rect
     */
    public clear(rect?: [Position, Position]) {
        let x = 0;
        let y = 0;
        let w = this.$el.width;
        let h = this.$el.height;

        if (rect) {
            x = Math.min(rect[0].x, rect[1].x);
            y = Math.max(rect[0].y, rect[1].y);
        }

        this.ctx.clearRect(x, y, w, h);

        return this
    }

    /**
     * 绘制文字
     * @param text
     * @param point
     * @param style
     */
    public drawText(text: string, point: Position, style?: Style) {
        const p = this.convertPoint(point);

        this.applyStyle(style);

        this.ctx.fillText(text, p.x, p.y);

        this.resetStyle();

        return this
    }



    public drawMultiText(text: string, lineHeight: number, pos: Position) {
        const ctx = this.ctx
        const { x, y } = pos
        text.split('\n').forEach((text, index, arr) => {
            let text0_width = ctx.measureText(arr[0]).width
            let text_width = ctx.measureText(text).width
            let offset = (() => {
                if (index === 0) {
                    return 0
                } else {
                    if (text_width < text0_width) {
                        return (text0_width - text_width) / 4
                    }
                    else {
                        return Math.floor(text0_width / 4)
                    }
                }
            })()
            ctx.fillText(text, x - (offset), y + index * lineHeight);
            this.drawText
        })
        return this
    }




    /**
     * 绘制圆点
     * @param point
     * @param radius
     * @param style
     */
    public drawPoint(point: Position, radius: number, style?: Style) {
        const { x, y } = this.convertPoint(point);
        const r = this.convertPixel(radius);

        this.applyStyle(style);

        this.ctx.beginPath();
        this.ctx.arc(x, y, r, 0, Math.PI * 2);
        if (style?.fillStyle) {
            this.ctx.fill();
        }
        if (style?.strokeStyle) {
            this.ctx.stroke();
        }

        this.resetStyle();

        return this
    }

    /**
     * 绘制折线
     * @param point1
     * @param point2
     * @param style
     */
    public drawLine(point1: Position, point2: Position, style?: Style) {
        const p1 = this.convertPoint(point1);
        const p2 = this.convertPoint(point2);

        this.applyStyle(style);

        this.ctx.beginPath();
        this.ctx.moveTo(p1.x, p1.y);
        this.ctx.lineTo(p2.x, p2.y);
        this.ctx.stroke();

        this.resetStyle();

        return this
    }

    /**
     * 绘制矩形
     * @param point1
     * @param point2
     * @param style
     */
    public drawRect(point1: Position, point2: Position, style?: Style) {
        const p1 = this.convertPoint(point1);
        const p2 = this.convertPoint(point2);
        const x = Math.min(p1.x, p2.x);
        const y = Math.min(p1.y, p2.y);
        const w = Math.abs(p1.x - p2.x);
        const h = Math.abs(p1.y - p2.y);

        this.applyStyle(style);

        this.ctx.beginPath();
        this.ctx.rect(x, y, w, h);
        if (style?.fillStyle) {
            this.ctx.fill();
        }
        if (style?.strokeStyle) {
            this.ctx.stroke();
        }

        this.resetStyle();

        return this
    }

    /**
     * 绘制弧形
     * @param center
     * @param radius
     * @param startAngle
     * @param endAngle
     * @param style
     */
    public drawArc(
        center: Position,
        radius: number,
        startAngle: number,
        endAngle: number,
        style?: Style
    ) {
        const p = this.convertPoint(center);
        const r = this.convertPixel(radius);

        this.applyStyle(style);

        this.ctx.beginPath();
        if (style?.fillStyle) {
            this.ctx.moveTo(p.x, p.y);
        }
        this.ctx.arc(p.x, p.y, r, startAngle, endAngle);
        if (style?.fillStyle) {
            this.ctx.fill();
        }
        if (style?.strokeStyle) {
            this.ctx.stroke();
        }

        this.resetStyle();

        return this
    }


    public async drawImage(source: string | HTMLCanvasElement, point1?: Position, point2?: Position, style?: Style) {

        const { x: start_x, y: start_y } = point1 || { x: 0, y: 0 }
        const { x: end_x, y: end_y } = point2 || { x: this.width, y: this.height }
        this.applyStyle(style);
        if (typeof source === 'string') {
            const imgLoadEnd = new Promise<HTMLImageElement | false>((resolve, reject) => {
                let img = new Image();
                const isSvg = source.includes('<svg')
                if (isSvg) {
                    img.src = 'data:image/svg+xml;base64,' + window.btoa(source)
                } else {
                    img.src = source
                }
                img.onload = () => {
                    resolve(img)
                }
                img.onerror = () => {
                    reject(false)
                }
            })

            const image = await imgLoadEnd

            if (image) {

                this.ctx.drawImage(
                    image,
                    start_x,
                    start_y,
                    end_x,
                    end_y
                );

            }
        } else {
            this.ctx.drawImage(
                source,
                start_x,
                start_y,
                end_x,
                end_y
            );
        }

        this.resetStyle();
        return this

    }
    public extends(...args: [source: string | HTMLCanvasElement, point1?: Position, point2?: Position, style?: Style]) {
        return this.drawImage(...args)
    }

    /**
     * 获取 canvas 标签，期望通过 drawImage 组合 canvas
     * @returns $el
     */
    getEl() {
        return this.$el
    }

    // 设备获取像素比
    getPixelRatio(context: CompWindow) {
        let backingStore = context.backingStorePixelRatio ||
            context.webkitBackingStorePixelRatio ||
            context.mozBackingStorePixelRatio ||
            context.msBackingStorePixelRatio ||
            context.oBackingStorePixelRatio ||
            context.backingStorePixelRatio || 1;
        return (window.devicePixelRatio || 1) / backingStore;
    };
}
