// This is the average angular radius of the Sun as seen from Earth over the
// course of the year. See https://docs.sunpy.org/en/stable/code_ref/sun.html
const AVERAGE_ANGULAR_RADIUS = 959.63;


class SolarDisk {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;

    private diskAngularDiameter: number;

    private pxDiskD: number;
    private pxDiskR: number;
    private center: number[];

    constructor (offDiskPercent: number = 20, center?: number[], diskAngularRadius?: number) {
        let canvas = document.getElementById('solarDisk') as HTMLCanvasElement;
        let context = canvas.getContext('2d') as CanvasRenderingContext2D;

        this.canvas = canvas;
        this.context = context;

        // Line style
        context.strokeStyle = 'black';
        context.lineWidth = 3;

        if (!center) {
            center = [this.canvas.clientWidth / 2, this.canvas.clientHeight / 2];
        }
        if (!diskAngularRadius) {
            diskAngularRadius = AVERAGE_ANGULAR_RADIUS;
        }
        this.diskAngularDiameter = diskAngularRadius * 2;
        this.center = center;

        const cSize = Math.min(this.canvas.clientHeight, this.canvas.clientWidth);
        this.pxDiskD = (cSize / 100) * (100 - offDiskPercent);
        this.pxDiskR = this.pxDiskD / 2;

        this.draw();
    }

    private drawLimb() {
        this.context.strokeStyle = '#FE7900';
        this.context.lineWidth = 3;

        this.context.beginPath();
        this.context.arc(this.center[0], this.center[1], this.pxDiskR, 0, Math.PI * 2);
        this.context.stroke();
    }

    /**
       convert pixel position relative to the center of the solar disk to coordinates in canvas space.
    */
    private centerToCanvas(xy: number[]) {
        return [xy[0] + this.center[0], this.center[1] - xy[1]];
    }

    /**
       Convert a "hpc" coordinate to pixel offsets with respect to the centre of the solar disk.
    */
    private hpcToPix(Tx: number, Ty: number) {
        const arcsecPerPix = this.diskAngularDiameter / this.pxDiskD;

        return [Tx / arcsecPerPix, Ty / arcsecPerPix];
    }

    /**
       Draw a bounding box in HPC coordinates on the canvas
     */
    public drawBoundingBox(bottom_left: number[], top_right: number[]) {
        let blPix = this.hpcToPix(bottom_left[0], bottom_left[1]);
        let trPix = this.hpcToPix(top_right[0], top_right[1]);
        blPix = this.centerToCanvas(blPix);
        trPix = this.centerToCanvas(trPix);

        // The canvas drawing draws from the top left, so we need to reoder our reference.
        const left_top = [blPix[0], trPix[1]];
        const right_bottom = [trPix[0], blPix[1]];

        const width = right_bottom[0] - left_top[0];
        const height = right_bottom[1] - left_top[1];

        this.context.strokeStyle = 'black';
        this.context.strokeRect(left_top[0], left_top[1], width, height);

    }

    public draw() {
        this.drawLimb();
        this.context.beginPath();
        this.context.arc(this.center[0], this.center[1], 2, 0, Math.PI*2);
        this.context.stroke();
    }

}

window.onload = () => {
    const disk = new SolarDisk();
    disk.drawBoundingBox([0, 0], [504, 504]);
}
