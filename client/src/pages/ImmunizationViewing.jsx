import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ImmunizationTable from "../components/ImmunizationTable";
import ParentNavigation from "../components/ParentNavigation";

function ImmunizationViewing() {
  const location = useLocation();
  const [children, setChildren] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // If state has children data, use it
    if (location.state && location.state.children) {
      setChildren(location.state.children);
      sessionStorage.setItem(
        "childrenData",
        JSON.stringify(location.state.children)
      );
    } else {
      // If no state, try to retrieve it from sessionStorage
      const storedChildrenData = sessionStorage.getItem("childrenData");
      if (storedChildrenData) {
        setChildren(JSON.parse(storedChildrenData));
      } else {
        // Navigate to the home page if no children data is available
        navigate("/");
      }
    }
  }, [location.state, navigate]);

  return (
    <div>
      <div className="px-10 pt-4 mb-10">
        {children && <ParentNavigation parentId={children[0].parent_id} />}
      </div>
      <div className="px-4 mb-6">
        <h1 className="text-base font-bold">Immunization Record</h1>
        <p className="text-base text-gray-600">
          Track and monitor your child's vaccination history
        </p>
      </div>
      {children ? (
        <div>
          <div>
            {children.map((child) => (
              <div key={child.child_id}>
                {/* Render ImmunizationTable and pass the childId as a prop */}
                <ImmunizationTable childId={child.child_id} />
                <hr className="my-8" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>No children data available.</p>
      )}
    </div>
  );
}

export default ImmunizationViewing;
