import { TextField, Typography, useMediaQuery,Box,Button,useTheme } from "@mui/material";
import {Formik} from "formik"
import { useState } from "react";
import Dropzone from "react-dropzone";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setLogin } from "../../states";
import * as yup from "yup"
import FlexBetween from "../../components/FlexBetweens";

const registerSchema=yup.object().shape({
    firstName:yup.string().required("required"),
    lastName:yup.string().required("required"),
    email:yup.string().email("Invalid email").required("required"),
    password:yup.string().required("required"),
    location:yup.string().required("required"),
    occupation:yup.string().required("required"),
    picture:yup.string()
});

const loginSchema=yup.object().shape({
    email:yup.string().email("Invalid email").required("required"),
    password:yup.string().required("required")
});

const initialValueRegister={
    firstName:"",
    lastName:"",
    email:"",
    password:"",
    location:"",
    occupation:"",
    picture:""
};

const initialValueLogin={
    email:"",
    password:""
}

const Form = () => {
    const [pageType,setPageType]=useState("login");
    const {palette}=useTheme();
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const isNonMobile=useMediaQuery("(min-width:600px)");
    const isLogin=pageType==="login";
    const isRegister=!isLogin
    const handleRegister=async(values,onSubmitProps)=>{
        const formData=new FormData();
        for(let value in values){
            formData.append(value,values[value]);
        }
        if(values.picture){
            formData.append("picturePath",values.picture.name);
        }
        else formData.append("picturePath","")
        const res=await fetch(
            "http://localhost:4000/auth/register",
            {
                method: "POST",
                body: formData
            }
        )
        if(res.status===500){
            alert("Unxpected error");
            return;
        }
        const user=await res.json();
        onSubmitProps.resetForm();
        if(user)setPageType("login");
    }

    const handleLogin=async(values,onSubmitProps)=>{
        const res=await fetch(
            `http://localhost:4000/auth/login`,
            {
                method: "POST",
                headers:{"Content-Type": "application/json"},
                body: JSON.stringify(values)
            }
        )
        const loggedIn=await res.json();
        onSubmitProps.resetForm();
        if(loggedIn){
            dispatch(
                setLogin({
                    user:loggedIn.user,
                    token:loggedIn.token,
                })
            )
            navigate("/home");
        }
    }

    const handleFormSubmit=(values,onSubmitProps)=>{
        if(isLogin)handleLogin(values,onSubmitProps);
        else handleRegister(values,onSubmitProps);
    }

    return (
        <Formik onSubmit={handleFormSubmit} initialValues={isLogin?initialValueLogin:initialValueRegister} validationSchema={isLogin?loginSchema:registerSchema} >
           {({values,errors,touched,handleBlur,handleChange,handleSubmit,setFieldValue,resetForm})=>(
            <form onSubmit={handleSubmit}>
                <Box display="grid" gap="30px" gridTemplateColumns="repeat(4,minmax(0,1fr))" sx={{"&>div":{gridColumn:isNonMobile?undefined:"span 4"}}}>
                    {isRegister&&(
                        <>
                            <TextField label="First Name" onBlur={handleBlur} onChange={handleChange} value={values.firstName} name="firstName"
                              error={Boolean(touched.firstName)&&Boolean(errors.firstName)}  helperText={touched.firstName&&errors.firstName} sx={{ gridColumn: "span 2" }}/>
                            <TextField label="Last Name" onBlur={handleBlur} onChange={handleChange} value={values.lastName} name="lastName"
                              error={Boolean(touched.lastName)&&Boolean(errors.lastName)}  helperText={touched.lastName&&errors.lastName} sx={{ gridColumn: "span 2" }}/>
                            <TextField label="Location" onBlur={handleBlur} onChange={handleChange} value={values.location} name="location"
                              error={Boolean(touched.location)&&Boolean(errors.location)}  helperText={touched.location&&errors.location} sx={{ gridColumn: "span 4" }}/>
                            <TextField label="Occupation" onBlur={handleBlur} onChange={handleChange} value={values.occupation} name="occupation"
                              error={Boolean(touched.occupation)&&Boolean(errors.occupation)}  helperText={touched.occupation&&errors.occupation} sx={{ gridColumn: "span 4" }}/>
                            
                            <Box gridColumn="span 4" border={`1px solid ${palette.neutral.medium}`} borderRadius="5px" p="1rem">
                                <Dropzone acceptedFile=".jpg,.jpeg,.png" multiple={false} onDrop={(acceptedFile)=>setFieldValue("picture",acceptedFile[0])}>
                                    {({getRootProps,getInputProps})=>(
                                        <Box {...getRootProps()} border={`2px dashed ${palette.primary.main}`} p="1rem" sx={{":hover":{cursor:"pointer"}}}>
                                            <input {...getInputProps()}/>
                                            {!values.picture?(
                                                <p>Add picture here</p>
                                            ):(
                                                <FlexBetween>
                                                    <Typography>{values.picture.name}</Typography>
                                                </FlexBetween>
                                            )}
                                        </Box>
                                    )}
                                </Dropzone>
                            </Box>
                        </>
                    )}
                    <TextField label="Email" onBlur={handleBlur} onChange={handleChange} value={values.email} name="email"
                      error={Boolean(touched.email)&&Boolean(errors.email)} helperText={touched.email && errors.email} sx={{gridColumn:"span 4"}}/>
                    <TextField type="password" label="Password" onBlur={handleBlur} onChange={handleChange} value={values.password} name="password"
                      error={Boolean(touched.password)&&Boolean(errors.password)} helperText={touched.password && errors.password} sx={{gridColumn:"span 4"}}/>                      
                </Box>
                
                {/*Submit*/}
                <Box>
                    <Button fullWidth type="submit" sx={{m:"2rem 0",p:"1rem",backgroundColor:palette.primary.main,color:palette.background.alt,":hover":{color:palette.primary.main}}}>
                        {isLogin ? "Login" : "Register"}
                    </Button>
                    <Typography onClick={()=>{setPageType(isLogin? "register": "login");resetForm();}}
                      sx={{textDecoration:"underline",color:palette.primary.main,":hover":{cursor:"pointer",color:palette.primary.light}}}>
                        {isLogin ? "Don't have an account? Sign up here" : "Already have an account? Login here"}
                    </Typography>
                </Box>
            </form>
           )}
        </Formik>
    )
}

export default Form;