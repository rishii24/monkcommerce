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

  const handleModal = () => {
    setmodal(!modal);
  };

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(productsField);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setProductsField(items);
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center mx-8 my-2">
        <MonkLogo /> <span className="ml-4">Monk Upsell & Cross-sell</span>
      </div>
      <div className="flex flex-col px-32 py-12 border-t-2">
        <div className="text-xl">Add Products</div>
        <div className="flex mt-4 w-5/12 justify-around">
          <div>Products</div>
          <div>Discount</div>
        </div>
        <div className="flex flex-col my-8 mx-8">
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
                              className="flex justify-around items-center my-2"
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              ref={provided.innerRef}
                            >
                              <Drag />
                              <div>{index + 1}.</div>
                              <div className="flex px-2 py-1 bg-white items-center shadow-sm border">
                                <input
                                  type="text"
                                  value={data?.name}
                                  placeholder="Select Product"
                                  disabled
                                  className="bg-white"
                                />
                                <button onClick={() => handleModal()}>
                                  <Edit />
                                </button>
                              </div>
                              <div>
                                <button
                                  onClick={() => {
                                    settoggle(true);
                                  }}
                                  className="outline-none border-none px-4 py-1 bg-primary text-white rounded-sm"
                                  style={{
                                    display: toggle ? "none" : "block",
                                  }}
                                >
                                  Add Discount
                                </button>

                                <div
                                  className="ml-4 w-full justify-between"
                                  style={{
                                    display: !toggle ? "none" : "flex",
                                  }}
                                >
                                  <input
                                    type="text"
                                    value={data?.discount}
                                    placeholder="Discount"
                                    className="px-2 py-1 bg-white items-center shadow-sm border"
                                  />
                                  <select className="px-2 py-1 border">
                                    <option> % off</option>
                                    <option> flat % off</option>
                                  </select>
                                </div>
                              </div>
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
        />
      )}
    </div>
  );
};

export default ProductList;
