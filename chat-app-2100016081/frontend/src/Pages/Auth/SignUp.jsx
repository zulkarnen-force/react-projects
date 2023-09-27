import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, useToast } from "@chakra-ui/react";

function SignUp() {

    const navigate = useNavigate();

    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [confirmpassword, setconfirmPassword] = useState();
    const [pic, setPic] = useState();

    const [loading, setLoading] = useState(false);
    const toast = useToast()

    const [showPassword, setShowPassword] = useState(false);

    const postDetails = (pics) => {
        setLoading(true);
        if (pics === undefined) {
            toast({
                title: 'Mohon pilih gambar yang benar',
                status: 'error',
                duration: 2000,
                position: 'top-right',
                isClosable: true,
            })
            return;
        }

        if (pics.type === "image/jpeg" || pics.type === "image/png") {
            const data = new FormData();
            data.append("file", pics);
            data.append("upload_preset", "chat-app");
            data.append("cloud_name", "dqdtwy9kw");
            fetch("https://api.cloudinary.com/v1_1/dqdtwy9kw/image/upload", {
                method: "post",
                body: data,
            }).then((res) => res.json())
                .then(data => {
                    setPic(data.url.toString());
                    console.log(data.url.toString());
                    setLoading(false);
                })
                .catch((err) => {
                    console.log(err);
                    setLoading(false);
                });
        } else {
            toast({
                title: 'Pilih gambar terlebih dahulu',
                status: 'error',
                duration: 2000,
                position: 'top-right',
                isClosable: true,
            })
            setLoading(false);
            return;
        }
    }

    const handleSubmit = async () => {
        setLoading(true);
        if (name === undefined || email === undefined || password === undefined || confirmpassword === undefined) {
            toast({
                title: 'Mohon isi semua kolom!',
                status: 'warning',
                duration: 2000,
                position: 'top-right',
                isClosable: true,
            })
            setLoading(false);
            return;
        }

        if (password !== confirmpassword) {
            toast({
                title: 'Password tidak sama',
                status: 'error',
                duration: 2000,
                position: 'top-right',
                isClosable: true,
            })
            setLoading(false);
            return;
        }

        try {
            const config = {
                headers: {
                    "Content-type": "application/json"
                },
            };

            const { data } = await axios.post(
                "https://chat-app-2100016081-api.vercel.app/api/user/signup",
                { name, email, password, pic },
                config
            );
            toast({
                title: 'Registrasi berhasil',
                status: 'success',
                duration: 2000,
                position: 'top-right',
                isClosable: true,
            })

            localStorage.setItem('userInfo', JSON.stringify(data))

            setLoading(false);
            navigate('/')
        } catch (error) {
            toast({
                title: error.response.data.message,
                status: 'error',
                duration: 2000,
                position: 'top-right',
                isClosable: true,
            })
            setLoading(false);
        }
    }

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("userInfo"))

        if (user) {
            navigate("/")
        }
    }, [navigate])

    return (
        <div className="h-full bg-gradient-to-tl from-blue-200 to-white-900 w-full py-16 px-4">


            <div className="flex items-center justify-center">
                <div className="bg-white shadow-xl rounded lg:w-1/3  md:w-1/2 w-full p-10">
                    <p aria-label="Login ke akun anda" className="text-2xl font-extrabold leading-6 text-gray-800">
                        Daftar untuk mendapatkan akses ke platform ini
                    </p>
                    <p className="text-sm my-5 font-medium leading-none text-gray-500">
                        Sudah memiliki akun?{" "}
                        <Link to={'/auth/login'} role="link" aria-label="Daftar" className="text-sm font-medium leading-none underline text-gray-800 cursor-pointer">
                            Masuk
                        </Link>
                    </p>

                    <form>
                        <div>
                            <label className="text-sm font-medium leading-none text-gray-800">Nama</label>
                            <input
                                type="text"
                                id="nama"
                                placeholder="Masukkan nama anda"
                                onChange={(e) => setName(e.target.value)}
                                className="bg-gray-200 border rounded focus:outline-none text-xs font-medium leading-none text-gray-800 py-3 w-full pl-3 mt-2" />
                        </div>

                        <div className="mt-6 w-full">
                            <label htmlFor="email" className="text-sm font-medium leading-none text-gray-800">Email</label>
                            <input
                                type="email"
                                id="email"
                                placeholder="email@gmail.com"
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-gray-200 border rounded focus:outline-none text-xs font-medium leading-none text-gray-800 py-3 w-full pl-3 mt-2" />
                        </div>

                        <div className="mt-6 w-full">
                            <label htmlFor="password" className="text-sm font-medium leading-none text-gray-800">Password</label>
                            <div className="relative flex items-center justify-center">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    placeholder="Masukkan password"
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="bg-gray-200 border rounded focus:outline-none text-xs font-medium leading-none text-gray-800 py-3 w-full pl-3 mt-2" />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                                >
                                    {showPassword ? (
                                        <i className="far fa-eye-slash"></i>
                                    ) : (
                                        <i className="far fa-eye"></i>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="mt-6 w-full">
                            <label htmlFor="password2" className="text-sm font-medium leading-none text-gray-800">Ulangi Password</label>
                            <div className="relative flex items-center justify-center">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password2"
                                    placeholder="Ulangi password"
                                    onChange={(e) => setconfirmPassword(e.target.value)}
                                    className="bg-gray-200 border rounded focus:outline-none text-xs font-medium leading-none text-gray-800 py-3 w-full pl-3 mt-2" />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                                >
                                    {showPassword ? (
                                        <i className="far fa-eye-slash"></i>
                                    ) : (
                                        <i className="far fa-eye"></i>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="mt-6 w-full">
                            <label htmlFor="pic" className="text-sm font-medium leading-none text-gray-800">Foto Profil</label>
                            <input
                                type="file"
                                id="pic"
                                accept="image/*"
                                onChange={(e) => postDetails(e.target.files[0])}
                                className="bg-gray-200 border rounded focus:outline-none text-xs font-medium leading-none text-gray-800 py-3 w-full pl-3 mt-2"
                            />
                        </div>


                        <Button
                            type="button"
                            className="mt-8 text-sm font-semibold leading-none border rounded py-4 w-full"
                            colorScheme='blue'
                            onClick={handleSubmit}
                            isLoading={loading}
                        >
                            Daftar
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default SignUp;
