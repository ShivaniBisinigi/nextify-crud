import { useState } from "react";
import { Flex, Text } from "@chakra-ui/react";
import { buildersData } from "@/data/builder";

import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { schema } from "@/schema";
enum GenderEnum {
  female = "female",
  male = "male",
  // other = "other",
}

interface IFormInput {
  name: string;
  gender: GenderEnum;
  mobileNumber:string;
  numberOfProjects:number;
  isVerified:boolean;
}



export default function Home() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<IFormInput>({
    resolver: zodResolver(schema),
  });

  const [editingId, setEditingId] = useState<string | null>(null);

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    if (editingId) {
      // Update builder data
      const builderIndex = buildersData.findIndex(
        (builder) => builder.id === editingId
      );
      if (builderIndex !== -1) {
        buildersData[builderIndex].name = data.name;
      }
      setEditingId(null);
    } else {
      // Add new builder data
      const newBuilder = { ...data, id: String(Math.random()) };
      buildersData.push(newBuilder);
    }
    // console.log("buildersData:", buildersData);
    // console.log(data);
  };

  const editHandler = (id: string) => {
    setEditingId(id);
    const builder = buildersData.find((builder) => builder.id === id);
    if (builder) {
      // Pre-fill the form with editing data
      setValue("name", builder.name);
      setValue("gender", builder?.gender);
      setValue("isVerified", builder?.isVerified);
      setValue("mobileNumber",builder?.mobileNumber)
      setValue('numberOfProjects',builder?.numberOfProjects)
    }
  };

  return (
    <>
      {/* Read BuilderData */}
      <button>Add</button>
      <Flex flexDir="column" gap={"30px"} mb="10">
        {buildersData.map((builder, index) => (
          <Flex key={index} gap={"10"}>
            <Text w="100px">{builder.name}</Text>
            <button onClick={() => editHandler(builder.id)}>Edit</button>
          </Flex>
        ))}
      </Flex>
      {/* Create or Edit Builder Form */}
      {editingId ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <label> Name</label>
          <input {...register("name")} />
          <p>{errors.name?.message}</p>
          <label>Gender Selection</label>
          <select {...register("gender")}>
            <option value="female">female</option>
            <option value="male">male</option>
            <option value="other">other</option>
          </select>
          <p>{errors.gender?.message}</p>
          <input type="submit" />
        </form>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <label> Name</label>
          <input {...register("name")} />
          <p>{errors.name?.message}</p>
          <label> Mobile Number</label>
          <input  {...register("mobileNumber")} />
          <p>{errors.mobileNumber?.message}</p>
          <label> Number of Projects</label>
          <input  {...register("numberOfProjects")} />
          <p>{errors.numberOfProjects?.message}</p>
          <label>Gender Selection</label>
          <label>
              <input type="radio" {...register("gender", { required: true })} value="male" />
              Male
            </label>
            <label>
              <input type="radio" {...register("gender", { required: true })} value="female" />
              Female
            </label>
          <p>{errors.gender?.message}</p>
          <label>
            <input type="checkbox" {...register("isVerified")} />
            Is Verified
          </label>
          {errors.isVerified && <p>Is Verified is required</p>}
          <input type="submit" />
        </form>
      )}
    </>
  );
}
