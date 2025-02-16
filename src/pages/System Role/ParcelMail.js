import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const ParcelMail = () => {
  const [weight, setWeight] = useState(1);
  const [parcelData, setParcelData] = useState();
  const handleWeightChange = (e) => setWeight(e.target.value);
  const { id1, id2 } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  useEffect(() => {
    axios
      .post(`http://api.parcelcalculator.sebs.asia/quote/get-quote`, {
        conTypeId: 5,
        from: {
          streetAddress: "string",
          locality: "string",
          postalCode: id1,
          country: "AU",
        },
        to: {
          streetAddress: "string",
          locality: "string",
          postalCode: "string",
          country: id2,
        },
        items: state?.formData?.items,
      })
      .then((res) => setParcelData(res?.data));
  }, [weight]);
  const handleClick = () => {
    navigate(`/shipment-details`, {
      state: { id1, id2, fromLocation: state?.fromLocation },
    });
  };
  return (
    <div className="w-full p-20">
      <div className="border border-2 w-full p-5">
        <div className="flex flex-col items-start gap-2">
          <h3>Features & Options </h3>

          {parcelData?.map((item) => {
            return (
              <div className="flex flex-col gap-2" key={item?.code}>
                <div className="flex gap-2">
                  <p>{item?.name}</p>
                  <p>{item?.code}</p>
                  <p>{item?.max_extra_cover}</p>
                </div>
                <div className="flex flex-col items-start gap-2">
                  {item?.options?.option?.map((opts) => {
                    return (
                      <div key={opts?.code} className="flex gap-2">
                        <input type="checkbox" defaultChecked />
                        <p>
                          {opts?.name}
                          {opts?.code}
                        </p>
                      </div>
                    );
                  })}
                </div>
                <div className="flex gap-2">
                  <label htmlFor="weight">Weight:</label>
                  <input
                    type="number"
                    value={weight}
                    onChange={handleWeightChange}
                  />
                  <p>Kg</p>
                  <p>Price: {item?.price}</p>
                </div>
              </div>
            );
          })}
        </div>
        <button onClick={handleClick}>Next</button>
      </div>
    </div>
  );
};
export default ParcelMail;
