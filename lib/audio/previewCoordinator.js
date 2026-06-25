let activePreview = null;

export function activatePreview(id, stop) {
    if (activePreview?.id === id) {
        activePreview = { id, stop };
        return;
    }
    const previousPreview = activePreview;
    activePreview = { id, stop };
    previousPreview?.stop();
}

export function deactivatePreview(id) {
    if (activePreview?.id === id) {
        activePreview = null;
    }
}
