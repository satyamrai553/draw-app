import axios from "axios";

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
    }
  | {
      type: "mouse";
    };

export async function initDraw(
  canvas: HTMLCanvasElement,
  roomId: string,
  socket: WebSocket,
  shapeRef: { current: string }
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let existingShape: Shape[] = (await getExistingShape(roomId)) || [];

  // Socket listener
  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    if (message.type === "chat") {
      try {
        const messageData =
          typeof message.message === "string"
            ? JSON.parse(message.message)
            : message.message;

        if (messageData.shape) {
          existingShape.push(messageData.shape);
          clearCanvas(existingShape, canvas, ctx);
        }
      } catch (e) {
        console.error("Error parsing message:", e);
      }
    }
  };

  clearCanvas(existingShape, canvas, ctx);

  let clicked = false;
  let startX = 0;
  let startY = 0;

  // Attach event listeners only once
  canvas.addEventListener("mousedown", (e) => {
    clicked = true;
    startX = e.clientX;
    startY = e.clientY;
  });

  canvas.addEventListener("mouseup", (e) => {
    if (!clicked) return;
    clicked = false;

    const width = e.clientX - startX;
    const height = e.clientY - startY;
    const radius = Math.abs(width / 2);

    let currShape: Shape = { type: "mouse" };
    if(shapeRef.current ==="mouse") return;

    if (shapeRef.current === "rect") {
      currShape = { type: "rect", x: startX, y: startY, width, height };
    }
    if (shapeRef.current === "circle") {
      currShape = {
        type: "circle",
        centerX: startX + width / 2,
        centerY: startY + height / 2,
        radius,
      };
    }

    existingShape.push(currShape);

    socket.send(
      JSON.stringify({
        type: "chat",
        message: JSON.stringify({ shape: currShape }),
        roomId: parseInt(roomId),
      })
    );
  });

  canvas.addEventListener("mousemove", (e) => {
    if (!clicked) return;

    const width = e.clientX - startX;
    const height = e.clientY - startY;
    clearCanvas(existingShape, canvas, ctx);

    if (shapeRef.current === "rect") {
      ctx.strokeStyle = "white";
      ctx.strokeRect(startX, startY, width, height);
    }
    if (shapeRef.current === "circle") {
      ctx.beginPath();
      ctx.arc(startX + width / 2, startY + height / 2, Math.abs(width / 2), 0, 2 * Math.PI);
      ctx.strokeStyle = "white";
      ctx.stroke();
    }
  });
}

function clearCanvas(existingShape: Shape[], canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  existingShape.forEach((shape) => {
    if (shape.type === "rect") {
      ctx.strokeStyle = "white";
      ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
    }
    if (shape.type === "circle") {
      ctx.beginPath();
      ctx.arc(shape.centerX, shape.centerY, shape.radius, 0, 2 * Math.PI);
      ctx.strokeStyle = "white";
      ctx.stroke();
    }
  });
}

async function getExistingShape(roomId: string) {
  try {
    const res = await axios.get(`http://localhost:3001/user/chats/${roomId}`);
    const messages = res.data.messages;
    return messages.map((x: { message: string }) => {
      const messageData = JSON.parse(x.message);
      return messageData.shape as Shape;
    });
  } catch (error) {
    console.error(error);
  }
}
