import React, { useState } from "react";
import ProductModal from "./ProductModal";
import { ReactComponent as MonkLogo } from "../assets/monklogo.svg";
import { ReactComponent as Edit } from "../assets/edit.svg";
import { ReactComponent as Drag } from "../assets/drag.svg";
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

  const handleModal = (idx) => {
    setmodal(!modal);
    setindextemp(idx);
  };

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(productsField);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setProductsField(items);
    setindextemp(result.destination.index);
    console.log(result);
  };

  const handleChildOnDragEnd = (result) => {
    // if (!result.destination) return;
    // const items = Array.from(productsField);
    // const [reorderedItem] = items.splice(result.source.index, 1);
    // items.splice(result.destination.index, 0, reorderedItem);
    // setProductsField(items);
    console.log(result);
  };

  console.log(indextemp, "outer");

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
                                      placeholder="Discount"
                                      className="px-2 py-1 bg-white items-center shadow-sm border text-sm"
                                    />
                                    <select className="px-2 py-1 border text-sm">
                                      <option> % off</option>
                                      <option> flat off</option>
                                    </select>
                                  </div>
                                </div>
                              </div>

                              {data && data?.variants?.length > 1 && (
                                <divc className="flex w-full justify-end">
                                  <button
                                    className="text-blue-500 font-semibold outline-none bg-none w-32 mt-2"
                                    onClick={() => {
                                      settogglevarients(!togglevarients);
                                      setindextemp(index);
                                    }}
                                  >
                                    {togglevarients && index === indextemp
                                      ? "- hide variants"
                                      : "+ show variants"}
                                  </button>
                                </divc>
                              )}
                              {data &&
                                data?.title &&
                                index === indextemp &&
                                togglevarients && (
                                  <div className="flex flex-col text-sm overflow-y-auto h-32 w-3/4 ml-10 my-4">
                                    <DragDropContext
                                      onDragEnd={handleChildOnDragEnd}
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
                                                            <div className="flex ml-4 w-2/3 justify-around items-center">
                                                              <input
                                                                type="text"
                                                                placeholder="Discount"
                                                                className="px-2 py-1 bg-white items-center shadow-sm border text-sm rounded-xl"
                                                              />
                                                              <select className="px-2 py-1 border text-sm rounded-xl">
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
