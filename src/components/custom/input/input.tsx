import {Input as PrimitiveInput} from "@/components/ui/input"
import {ChangeEventHandler} from "react"

type InputProps = {
    id?:string
    placeholder?:string
    type?:string
    value?:string
    onChange?: ChangeEventHandler<HTMLInputElement>
}

function Input({
    id,
    placeholder,
    value,
    onChange,
    type
}:InputProps ){
    return (
        <PrimitiveInput id = {id} placeholder={placeholder} type={type} value={value} onChange={onChange} className="py-6 placeholder:text-gray-400! bg-white text-black!"></PrimitiveInput>
    )
}

export {Input}