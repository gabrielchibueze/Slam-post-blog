import { useEffect } from "react";

export default function HandleErrorsHook(ref, errorHandler) {
    useEffect(() => {
        function activateModalClose(event) {
            if (ref?.current && !event.target.contains(ref?.current)) {
                return
            } 
            if(ref?.current.contains(event.target)){
                errorHandler();
            } 

        }

        document.addEventListener("mousedown", activateModalClose);
        document.addEventListener("touchstart", activateModalClose);

        return () => {
            document.removeEventListener("mousedown", activateModalClose);
            document.removeEventListener("touchstart", activateModalClose);
        };
    }, [ref, errorHandler]);
}
