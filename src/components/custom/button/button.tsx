import {Button as PrimitiveButton} from "@/components/ui/button" 
type ButtonProps = {
    children:string
}

function Button({children

}:ButtonProps ){
    return (
        <PrimitiveButton className="py-4 px-10 hover:bg-red-500 font-medium cursor-pointer"> {children}</PrimitiveButton>
    )
}

export {Button}