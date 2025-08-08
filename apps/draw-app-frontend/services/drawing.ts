type Shape =
  | {
      type: "rect";
      x: number;
      y: number;
      width: number;
      height: number;
    }
  | {
      type: "circle";
      centerX: number;
      centerY: number;
      radius: number;
    };

class DrawService {
  getDrawing(): Shape[] | null {
    const drawing = localStorage.getItem("drawing");
    if (drawing) {
      try {
        return JSON.parse(drawing) as Shape[];
      } catch {
        return null; 
      }
    }
    return null;
  }

  setDrawing(drawing: Shape[]): void {
    localStorage.setItem("drawing", JSON.stringify(drawing));
  }
}

const drawService = new DrawService();
export { drawService };
