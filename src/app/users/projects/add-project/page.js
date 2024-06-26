"use client";
import DashboardLayout from "@/layouts/DashboardLayout";
import React, { useState } from "react";

import { Select, message } from "antd";
import { TeamMemberData } from "@/lib/TeamMemberData";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/utils/LoadingSpinner";
import axios from "axios";
dayjs.extend(customParseFormat);
const dateFormat = "YYYY-MM-DD";

function formatedData(dateString) {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

const AddProject = () => {
  const router = useRouter();
  const [myDate, setDate] = useState(new Date());
  console.log(myDate);
  const selectedDate = (date, dateString) => {
    setDate(dateString);
  };

  const [loader, setLoader] = useState(false);
  const [teamMember, setTeamMember] = useState([]);
  const handleChange = (value) => {
    setTeamMember((prev) => [value]);
  };

  // form hook here
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const teams = teamMember[0]?.map((name, i) => ({ name, id: i }));

  // submission here
  const onSubmit = async (data) => {
    console.log(data);
    const teams = teamMember[0]?.filter((team) => {
      name: team;
    });
    const postData = {
      ...data,
      teams: teams,
      deadline: formatedData(myDate),
    };

    setLoader(true);
    try {
      const url = `${process.env.NEXT_PUBLIC_BASE_URL}/projects`;
      const { data: res } = await axios.post(url, postData);
      console.log(res);
      if (res?.id) {
        message.success("Project created successful.");
        router.push("/users/projects");
      }
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        message.error(error.response.data.message);
      }
    }
    setLoader(false);
  };
  return (
    <DashboardLayout>
      <h1 className="text-[18px] text-center uppercase py-[2px] bg-special border-2 border-black px-2 rounded-md mb-3 font-medium  text-primary">
        Create your new project
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        action=""
        className="bg-special py-3 pb-5 px-5 rounded-md border-2 border-black"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label htmlFor="Title" className="font-medium  text-[14px]">
              Title<span className="text-c_danger">*</span>
            </label>
            <input
              {...register("title", { required: true })}
              type="text"
              placeholder="Title"
              className="border outline-none text-[14px] mt-[2px] border-black px-[10px] py-[6px] rounded-md"
            />
          </div>

          <div className="flex flex-col mb-3">
            <label htmlFor="Title" className="font-medium  text-[14px]">
              Deadline<span className="text-c_danger">*</span>
            </label>
            <div className="border  mt-[2px] w-full border-black rounded-md">
              <DatePicker
                defaultValue={dayjs("2019-09-03", dateFormat)}
                minDate={dayjs("2024-05-02", dateFormat)}
                maxDate={dayjs("2024-12-31", dateFormat)}
                className="w-full"
                onChange={selectedDate}
              />
            </div>
          </div>

          <div className="flex flex-col mt-[-12px] mb-[14px] col-span-full">
            <label htmlFor="Title" className="font-medium text-[14px]">
              Assign Team Member<span className="text-c_danger">*</span>
            </label>
            <div className="border border-black  mt-[2px] rounded-md">
              <Select
                mode="multiple"
                allowClear
                style={{
                  width: "100%",
                }}
                placeholder="Please select"
                onChange={handleChange}
                options={TeamMemberData}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col h-full">
          <label htmlFor="Description" className="font-medium  text-[14px]">
            Description<span className="text-c_danger">*</span>
          </label>
          <textarea
            {...register("description", { required: true })}
            type="text"
            placeholder="Description"
            className="border text-[14px] h-[68px] min-h-[35px] border-black outline-none px-[10px] mt-[2px] py-1 rounded-md"
          />
        </div>

        <button
          type="submit"
          className="text-[16px] font-medium hover:bg-green-300 duration-150 bg-c_green py-[4px] pt-[2px]  px-5 w-full  mt-4 rounded-full shadow-md border-black border text-center"
        >
          {loader ? <LoadingSpinner /> : "Add a project"}
        </button>
      </form>
    </DashboardLayout>
  );
};

export default AddProject;
