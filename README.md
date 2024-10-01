
# SimpleElement.js Documentation

This script provides classes for creating 2D HTML overlays tied to 3D objects in a Three.js scene, dynamically repositioning and resizing them based on the camera view. In reality you only need SimpleElement.js so if you want to directly download it you can.

## Classes

### HTMLOverlay

This class is responsible for displaying a simple HTML overlay (iframe-like) that tracks a 3D object in screen space.

#### Methods

```javascript
HTMLOverlay.startAll(camera)
```
Starts the animation loop for all active `SimpleIFrame` instances. The camera's view-projection matrix is recalculated each frame.

```javascript
HTMLOverlay.stopAll()
```
Stops the animation loop.

```javascript
constructor(innerHTML, target, offset)
```
Creates a new `HTMLOverlay` instance.

- `innerHTML`: The HTML content to display in the div.
- `target`: The 3D object the overlay should track.
- `offset`: Optional position offset in pixels (default: `new THREE.Vector2(0, 0)`).

### HTMLOverlay3D

A more advanced version of `SimpleIFrame`, with additional features such as distance-based scaling and dynamic font resizing.

#### Constructor

```javascript
constructor(innerHTML, target, offset, scaleDistance, resizeOnlyText)
```
Creates a new `HTMLOverlay3D` instance.

- `innerHTML`: The HTML content for the panel.
- `target`: The 3D object to track.
- `offset`: Position offset in pixels (default: `new THREE.Vector2(0, 0)`).
- `scaleDistance`: Maximum distance for scaling the panel (default: `3000`).
- `resizeOnlyText`: Whether to resize only text elements (default: `true`).

#### Methods

- `recenterElement(camera, frustum)`: Repositions the HTML overlay to match the target's position in 2D screen space.
- `resizeFontsBasedOnParent()`: Dynamically resizes fonts based on the panel's size.


## Customizing the Overlay

If you want to change the look of the overlay, you can do so by modifying the CSS styles in the overlay class. This allows you to customize aspects like colors, fonts, and sizes to better fit your application’s design.

---

&copy; 2024 SimpleElement.js Documentation By Marko Kazimirovic (README by ChatGPT 4.o)



