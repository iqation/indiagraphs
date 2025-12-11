"use client";

import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import ReCAPTCHA from "react-google-recaptcha";
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from "@coreui/react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import RegisterForm from "../register/RegisterForm";

export type LoginFormProps = {
  loginModal: boolean;
  setLoginModal: (v: boolean) => void;
  closeLoginModal: any;
  openRegisterModal: any;
  // registerModal: boolean;
  // setRegisterModal: (v: boolean) => void;
};

// Validate env once
if (!process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) {
  throw new Error("NEXT_PUBLIC_RECAPTCHA_SITE_KEY is missing in .env.local");
}

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

const LoginForm = ({
  loginModal,
  setLoginModal,
  closeLoginModal,
  openRegisterModal,
}: LoginFormProps) => {
  const router = useRouter();
  const [verified, setVerified] = useState(false);
  const initialForm = { email: "", password_hash: "" };
  const [form, setForm] = useState(initialForm);
  // const [form, setForm] = useState({ email: "", password_hash: "" });
  const [verifyCaptcha, setVerifyCaptcha] = useState<any>(null);
  const [errors, setErrors] = useState<any>({});
  const [errorsToMany, setErrorsTooMany] = useState<any>(null);
  const [successLoginMsg, setSuccessLoginMsg] = useState<string>("");
  const [serverError, setServerError] = useState("");
  const [emailExists, setEmailExists] = useState<boolean | null>(null);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [submitEnabled, setSubmitEnabled] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  useEffect(() => {
    if (loginModal) {
      setForm(initialForm);
      setErrors({});
      setServerError("");
      setEmailExists(null);
      setSubmitEnabled(false);
    }
  }, [loginModal]);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors((prev: any) => ({
      ...prev,
      [e.target.name]: "",
    }));
    if (e.target.name === "email") {
      setEmailExists(null);
      setSubmitEnabled(false);
    }
  };

  const checkEmailExists = async () => {
    if (!form.email) return;

    setCheckingEmail(true);

    const res = await fetch("/api/auth/check-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.email }),
    });

    const data = await res.json();
    setCheckingEmail(false);

    if (data.exists) {
      setEmailExists(true);
      setErrors({ ...errors, email: "" });
      setSubmitEnabled(true);
    } else {
      setEmailExists(false);
      setErrors({ ...errors, email: data?.message });
      setSubmitEnabled(false);
    }
  };

  useEffect(() => {
    console.log("errorserrors ==>", errors);
  }, [errors]);

  const handleLogin = async () => {
    if (!form) return;
    setLoadingSubmit(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const result = await res.json();

      if (result.error) {
        setLoadingSubmit(false);
        setErrorsTooMany(
          result.error || "Too many attampts, please try it after some time"
        );
        return;
      }

      // setErrors(result?.errors);
      if (result.errors) {
        setErrors(result.errors);
        setLoadingSubmit(false);
        return;
      }

      if (result.success) {
        toast.success("Login successful! Redirecting...");
        setSuccessLoginMsg("Login successful");
        document.dispatchEvent(new Event("user-logged-in"));
        // setTimeout(() => {
        setLoadingSubmit(false);
        setLoginModal(false); // Show login modal
        // router.push("/accounts/dashboard");
        // }, 1000);
        // Reset form
        setForm({
          email: "",
          password_hash: "",
        });
      }
    } catch (error) {
      console.log(error);
      setLoadingSubmit(false); // STOP loader even if exception
    }
  };

  const closeModal = (e: any) => {
    closeLoginModal();
    setErrors((prev: any) => ({
      ...prev,
      [e.target.name]: "",
    }));
    setForm({
      email: "",
      password_hash: "",
    });
    setErrorsTooMany("");
    setSuccessLoginMsg("");
    setEmailExists(null);
    setSubmitEnabled(false);
  };
  return (
    <>
      <CModal
        visible={loginModal}
        backdrop="static"
        alignment="center"
        className="custom-login-modal"
      >
        <CModalHeader closeButton={false}>
          <CModalTitle>Login</CModalTitle>
        </CModalHeader>
        {errorsToMany && (
          <p className="login-error-text text-center">{errorsToMany}</p>
        )}
        {successLoginMsg && (
          <p className="login-error-text text-center">{successLoginMsg}</p>
        )}

        <CModalBody>
          <div className="mb-3 row">
            <input
              className="form-control mb-2"
              name="email"
              placeholder="Please enter Email"
              onChange={handleChange}
              onBlur={checkEmailExists}
            />
            {/* {errors?.email && (
              <p className="login-error-text py-0 smalltext">{errors?.email}</p>
            )} */}
            {checkingEmail && (
              <p className="smalltext text-info">Checking...</p>
            )}

            {emailExists === false && (
              <p className="login-error-text py-0 smalltext">{errors?.email}</p>
            )}
            {emailExists && (
              <>
                <input
                  className="form-control mb-2"
                  name="password_hash"
                  type="password"
                  placeholder="Please enter Password"
                  onChange={handleChange}
                />
                {errors?.password_hash && (
                  <p className="login-error-text smalltext">
                    {errors?.password_hash}
                  </p>
                )}
              </>
            )}
            {/* <div className="text-center mb-3">
            <ReCAPTCHA sitekey={RECAPTCHA_SITE_KEY} onChange={handleCaptcha} />
          </div> */}
          </div>
        </CModalBody>

        <CModalFooter>
          <div className="d-flex gap-2 mb-2  w-100">
            <Button
              variant="secondary"
              size="sm"
              className="flex-fill"
              onClick={closeModal}
            >
              Close
            </Button>

            <Button
              variant="primary"
              size="sm"
              className="flex-fill"
              onClick={handleLogin}
              disabled={!submitEnabled || loadingSubmit}
            >
              {loadingSubmit ? (
                <>
                  <span className="spinner-border spinner-border-sm"> </span>
                  <span> Submitting...</span>
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </div>
          <p className="text-center mt-2 mb-0 w-100">
            Don’t have an account?{" "}
            <span
              className="text-primary fw-bold"
              style={{ cursor: "pointer" }}
              onClick={openRegisterModal}
            >
              Register here
            </span>
          </p>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default LoginForm;
