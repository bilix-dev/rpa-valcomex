"use client";
import { useState } from "react";
import Modal from "./Modal";
import Image from "next/image";

export default ({
  title,
  status = { open: false, screenshot: null },
  setStatus,
}) => {
  return (
    <>
      <Modal
        activeModal={status.open}
        onClose={() => {
          setStatus({ ...status, open: false });
        }}
        title={title}
        labelClass="btn-outline-dark"
        uncontrol={false}
        className=" max-w-7xl "
      >
        <div className="grid justify-items-center">
          <Image
            src={
              status.screenshot
                ? `data:image/jpeg;base64,${status.screenshot}`
                : "/assets/images/logo/no-logo.png"
            }
            alt="screenshot"
            placeholder="blur"
            blurDataURL="/assets/images/loading_2.gif"
            width="0"
            height="0"
            sizes="100vw"
            style={{
              width: status.screenshot ? "100%" : "20%",
              height: "auto",
            }}
          />
        </div>
      </Modal>
    </>
  );
};
