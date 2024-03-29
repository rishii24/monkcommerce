import React, { useState } from "react";
import ProductModal from "./ProductModal";
import { ReactComponent as MonkLogo } from "../assets/monklogo.svg";
import { ReactComponent as Edit } from "../assets/edit.svg";
import { ReactComponent as Drag } from "../assets/drag.svg";
import { ReactComponent as Remove } from "../assets/close.svg";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const ProductList = () => {
  const [productsField, setProductsField] = useState([
    {
      name: "",
      discount: "",
      typeofdis: "",
    },
  ]);
  const [modal, setmodal] = useState(false);
  const [toggle, settoggle] = useState(false);
  const [togglevarients, settogglevarients] = useState(false);
  const [indextemp, setindextemp] = useState();

  const handleProductFields = () => {
    setProductsField([
      ...productsField,
      {
        name: "",
        discount: "",
        typeofdis: "",
      },
    ]);
  };

  ////////
  ////    adding discount to product
  ////////
  const handleDiscount = (e, index) => {
    let { name, value } = e.target;
    let newArray = [...productsField];
    newArray[index] = { ...newArray[index], [name]: value };
    setProductsField(newArray);
  };

  const handleModal = (idx) => {
    setmodal(!modal);
    setindextemp(idx);
  };

  const handlevarinttoggle = (index) => {
    settogglevarients(!togglevarients);
    setindextemp(index);
  };

  //////////
  //// to handle the products drag and drop rearrangement
  /////////

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(productsField);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setProductsField(items);
    setindextemp(result.destination.index);
  };

  //////////
  //// to handle the variants drag and drop rearrangement
  /////////

  const handleChildOnDragEnd = ({ result, index }) => {
    //// extracting variants array
    let temp = productsField.map((temp1, idx) => {
      if (idx === index) return temp1?.variants;
      else return;
    });

    if (!result.destination) return;
    if (temp) {
      const items = Array.from(temp[0]);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);

      /////
      // to array modified after drag and drop
      //////

      let newArray = [...productsField];
      newArray[index] = { ...newArray[index], variants: items };
      setProductsField(newArray);
    }
  };

  ///////////
  //// removing varients from the array
  //////////

  const handleVariantDelete = (id) => {
    //// extracting variants
    let temp = productsField.map((temp1, idx) => {
      if (indextemp === idx) return temp1?.variants;
    });
    ////filtering
    let removedVar = temp[0].filter((x) => x.id !== id);

    //// reassigning new array :)
    if (removedVar) {
      let newArray = [...productsField];
      newArray[indextemp] = { ...newArray[indextemp], variants: removedVar };
      setProductsField(newArray);
    }
  };

  console.log(productsField, "outer");

  return (
    <div className="flex flex-col">
      <div className="flex items-center mx-8 my-2">
        <MonkLogo /> <span className="ml-4">Monk Upsell & Cross-sell</span>
      </div>
      <div className="flex flex-col px-32 py-12 border-t-2 border-t-gray-300">
        <div className="text-xl">Add Products</div>

        <div className="flex flex-col my-8 mx-8">
          <div className="flex mt-4 justify-around w-2/3">
            <div>Products</div>
            <div>Discount</div>
          </div>
          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="droppable">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {productsField &&
                    productsField.map((data, index) => {
                      return (
                        <Draggable
                          index={index}
                          key={index}
                          draggableId={index.toString()}
                        >
                          {(provided) => (
                            <div
                              className="flex flex-col mt-8 mb-4 pb-8 border-b-2 w-2/3"
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              ref={provided.innerRef}
                            >
                              <div className="flex items-center">
                                <Drag />
                                <div className="mx-4 w-6">
                                  {index + 1} {"."}
                                </div>
                                {data?.title ? (
                                  <div className="flex px-2 py-1 w-1/3 justify-between bg-white items-center shadow-sm border text-sm">
                                    <span className="text-sm mr-4 whitespace-nowrap overflow-hidden overflow-ellipsis">
                                      {data?.title}
                                    </span>
                                    <button onClick={() => handleModal(index)}>
                                      <Edit />
                                    </button>
                                  </div>
                                ) : (
                                  <div className="flex px-2 py-1 w-1/3 justify-between bg-white items-center shadow-sm border text-sm">
                                    <input
                                      type="text"
                                      value={data?.name}
                                      placeholder="Select Product"
                                      disabled
                                      className="bg-white text-sm whitespace-nowrap overflow-hidden"
                                    />
                                    <button onClick={() => handleModal(index)}>
                                      <Edit />
                                    </button>
                                  </div>
                                )}
                                <div>
                                  <button
                                    onClick={() => {
                                      settoggle(true);
                                    }}
                                    className="outline-none border-none px-4 py-1 bg-primary text-white rounded-sm ml-6"
                                    style={{
                                      display: toggle ? "none" : "block",
                                    }}
                                  >
                                    Add Discount
                                  </button>

                                  <div
                                    className="ml-4 w-full justify-between items-center"
                                    style={{
                                      display: !toggle ? "none" : "flex",
                                    }}
                                  >
                                    <input
                                      type="text"
                                      value={data?.discount}
                                      onChange={(e) => handleDiscount(e, index)}
                                      name="discount"
                                      placeholder="Discount"
                                      className="px-2 py-1 bg-white items-center shadow-sm border text-sm outline-none"
                                    />
                                    <select
                                      className="px-2 py-1 border text-sm outline-none"
                                      name="typeofdis"
                                      value={data?.typeofdis}
                                      onChange={(e) => handleDiscount(e, index)}
                                    >
                                      <option hidden></option>
                                      <option value="% off"> % off</option>
                                      <option value="flat off">
                                        {" "}
                                        flat off
                                      </option>
                                    </select>
                                  </div>
                                </div>
                              </div>

                              {data && data?.variants?.length > 1 && (
                                <div className="flex w-full justify-end">
                                  <button
                                    className="text-blue-500 font-semibold outline-none bg-none w-32 mt-2"
                                    onClick={() => handlevarinttoggle(index)}
                                  >
                                    {togglevarients && index === indextemp
                                      ? "- hide variants"
                                      : "+ show variants"}
                                  </button>
                                </div>
                              )}
                              {data &&
                                data?.title &&
                                index === indextemp &&
                                togglevarients && (
                                  <div className="flex flex-col text-sm overflow-y-auto h-32 w-3/4 ml-10 my-4">
                                    <DragDropContext
                                      onDragEnd={(result) =>
                                        handleChildOnDragEnd({
                                          result: result,
                                          index: index,
                                        })
                                      }
                                    >
                                      <Droppable droppableId="droppable">
                                        {(provided) => (
                                          <div
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                          >
                                            {togglevarients &&
                                            index === indextemp
                                              ? data?.variants?.map(
                                                  (vardata, index) => {
                                                    return (
                                                      <Draggable
                                                        index={index}
                                                        key={index}
                                                        draggableId={index.toString()}
                                                      >
                                                        {(provided) => (
                                                          <div
                                                            className="flex items-center ml-2 my-2 py-2"
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            ref={
                                                              provided.innerRef
                                                            }
                                                          >
                                                            <Drag />
                                                            <span className="flex px-2 py-1 ml-4 bg-white items-center shadow-lg rounded-xl border w-1/3">
                                                              {vardata?.title}
                                                            </span>
                                                            <div className="flex ml-4 w-2/3 justify-around items-center ">
                                                              <input
                                                                type="text"
                                                                placeholder="Discount"
                                                                className="px-2 py-1 bg-white items-center shadow-sm border text-sm rounded-xl outline-none"
                                                              />
                                                              <select className="px-2 py-1 border text-sm rounded-xl outline-none">
                                                                <option>
                                                                  {" "}
                                                                  % off
                                                                </option>
                                                                <option>
                                                                  {" "}
                                                                  flat off
                                                                </option>
                                                              </select>
                                                            </div>
                                                            <button
                                                              onClick={() =>
                                                                handleVariantDelete(
                                                                  vardata?.id
                                                                )
                                                              }
                                                              className="mx-2"
                                                            >
                                                              <Remove className="h-2" />
                                                            </button>
                                                          </div>
                                                        )}
                                                      </Draggable>
                                                    );
                                                  }
                                                )
                                              : ""}
                                          </div>
                                        )}
                                      </Droppable>
                                    </DragDropContext>
                                  </div>
                                )}
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
        <button
          className="outline-none w-48 place-self-center px-5 py-2 border-2 border-primary text-primary rounded-sm"
          onClick={handleProductFields}
        >
          Add Product
        </button>
      </div>
      {modal && (
        <ProductModal
          productsField={productsField}
          setProductsField={setProductsField}
          setmodal={setmodal}
          pIndex={indextemp}
        />
      )}
    </div>
  );
};

export default ProductList;
