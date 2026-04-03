import {Button} from "@/components/custom/button";
import {Input} from "@/components/custom/input";

export default function LoginPage() {
  function handleLoginForm(){
    
  }
  return (
    <main className="bg-white-500 h-screen w-screen flex flex-row">
      <div className="bg-black w-1/2 items-center justify-center flex flex-col gap-8"> 
        <h1 className="text-white text-3xl font-bold">Log in</h1>
        <p className="text-white text-3xl font-bold">Ingresa tus credenciales para continuar</p>
        
      
      </div>
      <div className="bg-gray-500 w-1/2 gap-4 flex flex-col p-8 items-center justify-center" >
        <div className="w-1/2 gap-4"> 
         <Input type="email" placeholder="Email" />
        <Input type="password" placeholder="Password"/>
        <Button onClick={LogIn}>Log in</Button>
        </div>
      </div>


    </main>
  );
}
