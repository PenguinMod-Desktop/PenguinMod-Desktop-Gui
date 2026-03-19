export default (filename, blob) => {
    if (window.showSaveFilePicker) {
        (async () => {
          const handle = await window.showSaveFilePicker({
            suggestedName: filename
          });

          const writable = await handle.createWritable();
          await writable.write({ type: "truncate", size: 0 });
          await writable.write({ type: "write", position: 0, data: blob });
          await writable.close();
        })();
    } else {
        const downloadLink = document.createElement('a');
        document.body.appendChild(downloadLink);

        // Use special ms version if available to get it working on Edge.
        if (navigator.msSaveOrOpenBlob) {
            navigator.msSaveOrOpenBlob(blob, filename);
            alert('The file should appear in your downloads folder!');
            return;
        }

        if ('download' in HTMLAnchorElement.prototype) {
            const url = window.URL.createObjectURL(blob);
            downloadLink.href = url;
            downloadLink.download = filename;
            downloadLink.type = blob.type;
            downloadLink.click();
            // remove the link after a timeout to prevent a crash on iOS 13 Safari
            window.setTimeout(() => {
                document.body.removeChild(downloadLink);
                window.URL.revokeObjectURL(url);
            }, 1000);
        } else {
            // iOS 12 Safari, open a new page and set href to data-uri
            let popup = window.open('', '_blank');
            const reader = new FileReader();
            reader.onloadend = function () {
                popup.location.href = reader.result;
                popup = null;
            };
            reader.readAsDataURL(blob);
        }
        alert('The file should appear in your downloads folder!');
    }
};
