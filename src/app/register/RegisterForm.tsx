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
  CFormSelect,
} from "@coreui/react";

import mainCountries from "@/app/jsonData/mainCountries.json";
import otherCountriesData from "@/app/jsonData/otherCountries.json";
import { toast } from "react-toastify";

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

type Props = {
  registerModal: boolean;
  setRegisterModal: (value: boolean) => void;
  setLoginModal: (value: boolean) => void;
  closeRegisterModal: any;
};

export default function RegisterForm({
  registerModal,
  setRegisterModal,
  setLoginModal,
}: Props) {
  const initialForm = {
    full_name: "",
    email: "",
    password_hash: "",
    confirm_password: "",
    phone: "",
    country: "",
    otherCountry: "",
  };
  const [form, setForm] = useState(initialForm);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");
  const [errors, setErrors] = useState<any>("");
  const [successRegMsg, setSuccessRegMsg] = useState<String>("");

  const handleCaptcha = () => setCaptchaVerified(true);

  const countryList = mainCountries;
  const token = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  useEffect(() => {
    if (registerModal) {
      setForm(initialForm);
      setErrors({});
      setSuccessRegMsg("");
    }
  }, [registerModal]);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors((prev: any) => ({
      ...prev,
      [e.target.name]: "",
    }));
  };

  const handleCountryType = (e: any) => {
    setForm({
      ...form,
      country: "",
    });
    setErrors((prev: any) => ({
      ...prev,
      [e.target.name]: "",
    }));
  };

  const verifyCaptcha = async () => {
    if (!token) return;
    setCaptchaToken(token);
    const res = await fetch("/api/auth/verify-captcha", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }), // EXACT format you requested
    });

    const result = await res.json();

    if (result.success) {
      setCaptchaVerified(true);
    } else {
      setCaptchaVerified(false);
    }
  };

  const submitForm = async () => {
    // if (!captchaVerified) {
    //   return alert("Please complete captcha first!");
    // }

    if (form.password_hash !== form.confirm_password) {
      setErrors({
        ...errors,
        confirm_password: "Passwords do not match",
      });
      return;
    }
    console.log("other country form data ==>", form);

    const payload = {
      full_name: form.full_name,
      email: form.email,
      password_hash: form.password_hash,
      phone: form.phone,
      country: form.country !== "OTHER" ? form.country : form.otherCountry, //(country === "OTHER" ? form.country : ""),
    };
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await res.json();

    if (result.errors) {
      setErrors(result.errors);
      toast.error("Please correct the errors!");
      return;
    }
    console.log("result resultresult ==>", result);

    if (result.success) {
      toast.success("Registration successful!");

      setTimeout(() => {
        setRegisterModal(false); // Hide registration modal
        setLoginModal(true); // Show login modal
      }, 2000);

      setSuccessRegMsg("Registration successful, please login");

      // Reset form
      setForm({
        full_name: "",
        email: "",
        password_hash: "",
        confirm_password: "",
        phone: "",
        country: "",
        otherCountry: "",
      });
    }
  };

  const onCloseButton = (e: any) => {
    setRegisterModal(false);
    setErrors({});
    setForm(initialForm);
    setSuccessRegMsg("");
  };

  return (
    <>
      <CModal
        visible={registerModal}
        backdrop="static"
        alignment="center"
        className="custom-login-modal custom-register-modal"
      >
        <CModalHeader closeButton={false}>
          <CModalTitle>User Registration Form</CModalTitle>
        </CModalHeader>
        {successRegMsg && (
          <p className="text-success text-center smalltext">{successRegMsg}</p>
        )}
        <CModalBody>
          <div className="mb-3">
            <input
              className="form-control mb-2"
              name="full_name"
              placeholder="Please enter full name"
              onChange={handleChange}
            />
            {errors?.full_name && (
              <p className="text-danger smalltext">{errors?.full_name}</p>
            )}

            <input
              className="form-control mb-2"
              name="email"
              placeholder="Please enter Email"
              onChange={handleChange}
            />
            {errors?.email && (
              <p className="text-danger smalltext">{errors?.email}</p>
            )}
            <input
              className="form-control mb-2"
              name="password_hash"
              type="password"
              placeholder="Please enter Password"
              onChange={handleChange}
            />
            {errors?.password_hash && (
              <p className="text-danger smalltext">{errors?.password_hash}</p>
            )}
            <input
              className="form-control mb-2"
              name="confirm_password"
              type="password"
              placeholder="Confirm Password"
              onChange={handleChange}
            />
            {errors?.confirm_password && (
              <p className="text-danger smalltext">
                {errors?.confirm_password}
              </p>
            )}
            <input
              className="form-control mb-2"
              name="phone"
              placeholder="Please enter Phone"
              onChange={handleChange}
            />
            {errors?.phone && (
              <p className="text-danger py-0 smalltext">{errors?.phone}</p>
            )}
          </div>
          {/* COUNTRY SELECT */}
          <CFormSelect
            className="mb-2"
            name="country"
            onChange={handleChange}
            value={form.country}
          >
            <option value="">Select Country</option>

            {countryList.map((c) => (
              <option key={c.code} value={c.name}>
                {c.name}
              </option>
            ))}

            <option value="OTHER">Other</option>
          </CFormSelect>

          {/* IF USER SELECTS OTHER → SHOW SECOND DROPDOWN */}
          {form.country === "OTHER" && (
            <CFormSelect
              className="mb-2"
              name="otherCountry"
              onChange={handleChange}
            >
              <option value="">Select another country</option>
              {otherCountriesData?.others?.map((c) => (
                <option key={c.code} value={c.name}>
                  {c.name}
                </option>
              ))}
            </CFormSelect>
          )}
          <div className="text-center mb-3">
            <ReCAPTCHA sitekey={RECAPTCHA_SITE_KEY!} onChange={verifyCaptcha} />
          </div>
        </CModalBody>

        <CModalFooter>
          <div className="d-flex gap-2 mb-2  w-100">
            <Button
              variant="secondary"
              className="flex-fill"
              onClick={onCloseButton}
            >
              Close
            </Button>

            <Button
              variant="primary"
              className="flex-fill"
              // disabled={!captchaVerified}
              onClick={submitForm}
            >
              Submit
            </Button>
          </div>
        </CModalFooter>
      </CModal>
    </>
  );
}
