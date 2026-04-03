import {Input as PrimitiveInput} from "@/components/ui/input" 
type InputProps = {
    placeholder?:string
    type?:string
}

function Input({
    placeholder,
    type
}:InputProps ){
    return (
        <PrimitiveInput placeholder={placeholder} type={type} className="py-6 placeholder:text-blue-100!"></PrimitiveInput>
    )
}

export {Input}