/* eslint-disable react/prop-types */
import ButtonComponent from "./button";
import "./button.css"
export default function MultiButtonComponent({ props }) {
    let filteredButttonComponent;
    if(props.buttonProperties.length > 1){
        filteredButttonComponent = props.buttonProperties.filter(button => button.buttonTitle)
    } else {
        filteredButttonComponent = props.buttonProperties
    }
    return <div className="post-cancel-btns">
        {
            filteredButttonComponent.length > 0 && filteredButttonComponent.map((button) => {
                return <div key={button.buttonTitle}>
                    <ButtonComponent props={{
                        type: `${button?.buttonType}`,
                        title: `${button?.buttonTitle}`,
                        loading: button.loading,
                        link: button?.buttonLink || null,
                        onClick: button?.buttonFunction || null,
                        mode: button?.mode,
                        design: button?.design,
                        disabled: button.disabled
                    }}
                    />
                </div>
            })
        }

    </div>
}