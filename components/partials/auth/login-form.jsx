import React from "react";
import Textinput from "@/components/ui/Textinput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

// import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Button from "@/components/ui/Button";
const schema = yup
  .object({
    userName: yup.string().required("Usuario requerido"),
    password: yup.string().required("Contraseña requerida"),
  })
  .required();
const LoginForm = () => {
  // const dispatch = useDispatch();
  // const { users } = useSelector((state) => state.auth);
  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "all",
  });
  const router = useRouter();

  const onSubmit = async (data) => {
    var { error } = await signIn("credentials", { ...data, redirect: false });
    if (!error) {
      toast.success("Inicio de sesión exitoso");
      router.refresh();
      router.replace("/dashboard");
    } else {
      toast.warning("Usuario o contraseña inválidos");
    }
    // const user = users.find(
    //   (user) => user.email === data.email && user.password === data.password
    // );
    // if (user) {
    //   dispatch(handleLogin(true));
    //   setTimeout(() => {
    //     router.push("/analytics");
    //   }, 1500);
    // } else {
    //   toast.error("Invalid credentials", {
    //     position: "top-right",
    //     autoClose: 1500,
    //     hideProgressBar: false,
    //     closeOnClick: true,
    //     pauseOnHover: true,
    //     draggable: true,
    //     progress: undefined,
    //     theme: "light",
    //   });
    // }
  };

  //const [checked, setChecked] = useState(false);

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
      <Textinput
        name="userName"
        label="Usuario"
        placeholder="Usuario"
        type="text"
        register={register}
        error={errors?.userName}
      />
      <Textinput
        name="password"
        label="Contraseña"
        type="password"
        placeholder="Contraseña"
        register={register}
        error={errors.password}
        autoComplete="on"
      />
      <div className="flex justify-center">
        <Link
          href="/auth/forgot-password"
          className="text-sm text-slate-800 dark:text-slate-400 leading-6 font-medium"
        >
          ¿Olvidó la contraseña?
        </Link>
      </div>

      <Button
        text="Ingresar"
        type="submit"
        isLoading={isSubmitting}
        className="btn btn-dark block w-full text-center"
      />
    </form>
  );
};

export default LoginForm;
