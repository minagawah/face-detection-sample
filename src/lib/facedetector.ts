const int: Function = Math.trunc;

declare global {
  interface Window { FaceDetector: any; }
}

export const faceDetect: Function = async (ctx, img, options) => {
  if (!('FaceDetector' in window)) {
    throw new Error('No browser supports to handle face detection');
  }
  if (!ctx) throw new Error('No canvas contexts');
  if (!img) throw new Error('No images');
  const { scale = 1 } = options || {};
  
  const faceDetector = new window.FaceDetector();
  const faces = await faceDetector.detect(img);

  for (let face of faces) {
    const { boundingBox = null, landmarks = [] } = face || {};
    if (boundingBox) {
      const { top, left, width, height } = boundingBox;
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'red';
      ctx.rect(
        int(left * scale),
        int(top * scale),
        int(width * scale),
        int(height * scale)
      );
      ctx.stroke();
    }
    if (landmarks.length) {
      ctx.lineWidth = 1;
      landmarks.forEach((land) => {
        const { locations = [] } = land || {};
        if (locations.length) {
          locations.forEach((loc, i) => {
            if (i > 0) {
              ctx.lineTo(loc.x, loc.y);
            }
            ctx.moveTo(loc.x, loc.y);
          });
          ctx.lineTo(locations[0].x, locations[0].y);
        }
      });
      ctx.stroke();
    }
  }
};
