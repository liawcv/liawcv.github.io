function crop(f, w, h) {
    return new Promise((resolve, reject) => { 
        const img = document.createElement('img');
        
        img.onload = e => {
            URL.revokeObjectURL(img.src);
            
            // Resize algorithm ---------------------------
            let ratio = w / h;

            let nw = img.naturalWidth;
            let nh = img.naturalHeight;
            let nratio = nw / nh;

            let sx, sy, sw, sh;

            if (ratio >= nratio) {
                // Retain width, calculate height
                sw = nw;
                sh = nw / ratio;
                sx = 0;
                sy = (nh - sh) / 2;
            }
            else {
                // Retain height, calculate width
                sw = nh * ratio;
                sh = nh;
                sx = (nw - sw) / 2;
                sy = 0;
            }
            // --------------------------------------------

            const can = document.createElement('canvas');
            can.width  = w;
            can.height = h;
            can.getContext('2d').drawImage(img, sx, sy, sw, sh, 0, 0, w, h);

            // Resolve to image
            img.onload = e => resolve(img);
            img.src = can.toDataURL();
        };

        img.onerror = e => {
            URL.revokeObjectURL(img.src);
            reject('ERROR: File is not an image');
        };

        img.src = URL.createObjectURL(f);
    });
}
