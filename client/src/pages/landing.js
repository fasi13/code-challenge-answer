import React, { useEffect, useState } from "react";
import axios from "axios";
import "antd/dist/antd.css";
import { Table, Space, Button, notification, Modal } from "antd";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {formatDateTime} from '../utils/helper'


const Landing = () => {
  const [devices, setDevices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [device, setDevice] = useState(null);
  const [isCreateMode, setNavigationMode] = useState(true);

  const onEditHandler = (text) => {
    setDevice(text);
    setIsModalVisible(true);
    setNavigationMode(false);
  };

  const onAddHandler = () => {
    if (devices.length > 9) {
      notification.info({
        message: `Not Allowed`,
        description: "Max number of allowed in the garage is 10",
      });
    } else {
      setIsModalVisible(true);
    }
  };

  const onDeleteHandler = (id) => {
    axios
      .delete("/api/device/" + id)
      .then(() => {
        notification.info({
          message: `Device successfully deleted`,
        });
        renderDevice();
      })

      .catch((error) => {
        if (error.response) {
          console.log(error.response);
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log("Error", error.message);
        }
        console.log(error.config);
        setIsLoading(false);
      });
  };

  const renderDevice = () => {
    axios
      .get("/api/device")
      .then((response) => {
        setDevices([...response.data.devices]);
        setIsLoading(false);
      })

      .catch((error) => {
        if (error.response) {
          console.log(error.response);
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log("Error", error.message);
        }
        console.log(error.config);
        setIsLoading(false);
      });
  };

  const columns = [
    {
      title: "Device",
      dataIndex: "device",
      key: "age",
    },
    {
      title: "Manufacturer",
      dataIndex: "manufacturer",
      key: "manufacturer",
    },
    {
      title: "OS",
      key: "os",
      dataIndex: "os",
    },
    {
      title: "LastCheckedOutDate",
      key: "action",
      render: (item) => {

        return <p>{formatDateTime(item.lastCheckedOutDate)}</p>;
      },
    },
    {
      title: "LastCheckedOutBy",
      key: "action",
      dataIndex: "lastCheckedOutBy",
    },
    {
      title: "is Checked Out",
      key: "isCheckedOut",
      render: (item) => (
         <input type="checkbox" checked={item.isCheckedOut}/>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (text) => (
        <Space size="middle">
          <Button
            className="text-purple-50 bg-green-900"
            onClick={() => onEditHandler(text)}
          >
            Edit
          </Button>
          <Button
            className="text-purple-50 bg-red-900"
            onClick={() => onDeleteHandler(text._id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    renderDevice();
  }, []);

  const deviceSchema = Yup.object().shape({
    device: Yup.string().required("Please fill out this field"),
    os: Yup.string().required("Please fill out this field"),
    manufacturer: Yup.string().required("Please fill out this field"),
    lastCheckedOutBy: Yup.string().required("Please fill out this field"),
  });

  const RenderModal = () => {
    return (
      <Modal
        title="Add Device"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okButtonProps={{ disabled: true }}
        footer={null}
      >
        <Formik
          enableReinitialize={true}
          initialValues={
            device != null
              ? {
                  device: device.device,
                  os: device.os,
                  manufacturer: device.manufacturer,
                  lastCheckedOutBy: device.lastCheckedOutBy,
                  isCheckedOut: device.isCheckedOut,
                }
              : {
                  device: "",
                  os: "",
                  manufacturer: "",
                  lastCheckedOutBy: "",
                  isCheckedOut: false,
                }
          }
          validationSchema={deviceSchema}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            setSubmitting(true);
            var data = {
              device: values.device,
              os: values.os,
              manufacturer: values.manufacturer,
              lastCheckedOutBy: values.lastCheckedOutBy,
              isCheckedOut: values.isCheckedOut ? true : false,
            };
            if (isCreateMode) {
              axios
                .post("/api/device/", data)
                .then((response) => {
                  notification.info({
                    message: `Device Added Successfully `,
                  });
                  resetForm();
                  handleCancel();
                  renderDevice();
                })
                .catch((error) => {
                  if (error.response) {
                    console.log(error.response);
                  }
                  console.log(error.config);
                });
            } else {
              axios
                .put("/api/device/" + device._id, data)
                .then((response) => {
                  notification.info({
                    message: `Device Updated `,
                    description: "Device Updated Successfully",
                  });
                  resetForm();
                  handleCancel();
                  renderDevice();
                  setDevice(null);
                  setNavigationMode(true);
                })
                .catch((error) => {
                  if (error.response) {
                    console.log(error.response);
                  }
                  console.log(error.config);
                });
            }
          }}
        >
          {({ isSubmitting, errors }) => (
            <Form className="w-full max-w-lg">
              {errors.error && <p className="form-error">{errors.error}</p>}
              <div class="flex flex-wrap -mx-3 mb-6">
                <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                  <label
                    class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    for="grid-first-name"
                  >
                    Device Name
                  </label>
                  <Field
                    class="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                    type="text"
                    name="device"
                  />
                  <ErrorMessage
                    name="device"
                    component="div"
                    className="text-red-500 text-xs italic pt-0"
                  />
                </div>
                <div class="w-full md:w-1/2 px-3">
                  <label
                    class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    for="grid-last-name"
                  >
                    Operating System
                  </label>
                  <Field
                    class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    type="text"
                    name="os"
                  />
                  <ErrorMessage
                    name="os"
                    component="div"
                    className="text-red-500 text-xs italic pt-0"
                  />
                </div>
                <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                  <label
                    class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    for="grid-first-name"
                  >
                    Manufacturer
                  </label>
                  <Field
                    class="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                    type="text"
                    name="manufacturer"
                  />
                  <ErrorMessage
                    name="manufacturer"
                    component="div"
                    className="text-red-500 text-xs italic pt-0"
                  />
                </div>
                <div class="w-full md:w-1/2 px-3">
                  <label
                    class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    for="grid-last-name"
                  >
                    Last Checked Out By
                  </label>
                  <Field
                    class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    type="text"
                    name="lastCheckedOutBy"
                  />
                  <ErrorMessage
                    name="lastCheckedOutBy"
                    component="div"
                    className="text-red-500 text-xs italic pt-0"
                  />
                </div>
                <div class="w-full md:w-1/2 px-3 py-5 flex">
                  <Field
                    className="border-gray-800 mt-1"
                    type="checkbox"
                    name="isCheckedOut"
                  />
                  <label
                    class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 pl-2"
                    S
                  >
                    Is Checked Out
                  </label>
                </div>
              </div>
              <div className="text-center">
                <Button
                  className="text-purple-50 bg-blue-600"
                  htmlType="submit"
                  disabled={isSubmitting}
                >
                  Submit
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>
    );
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-12 gap-4 mx-4 text-center  text-base">
      <div className="col-start-2 col-span-10 text-center font-bold text-lg pt-12">
        <div className="pb-8">
          Johnson and Johnson Full Stack Coding Challenge
        </div>

        <div className="text-right">
          <Button
            className="text-purple-50 bg-blue-600"
            onClick={() => {
              onAddHandler();
            }}
          >
            Add Device
          </Button>
        </div>
        <div>
          <Table columns={columns} dataSource={devices} />
        </div>
      </div>
      {RenderModal()}
    </div>
  );
};
export default Landing;
