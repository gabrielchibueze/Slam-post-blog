/* eslint-disable react/prop-types */

import "./image-preview.css"
export default function ImagePreview({ props }) {
    return <div className="image-display__helper"
        style={{
            backgroundImage: `url("${props.imageURL}")`,
            backgroundSize: props.contian ? "contain" : "cover",
            backgroundPosition: props.left ? "left" : "center"
        }} />
}