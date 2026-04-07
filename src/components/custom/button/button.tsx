import {Button as PrimitiveButton} from "@/components/ui/button" 
import {ButtonHTMLAttributes} from 'react'
type ButtonProps = {
    children:string
    type?: "submit" | "button" | "reset"
}

function Button({
    type,
    children

}:ButtonProps ){
    return (
        <PrimitiveButton type = {type} className="py-4 px-10 hover:bg-red-500 font-medium cursor-pointer"> {children}</PrimitiveButton>
    )
}

export {Button}