import express from "express";
import mysql from "mysql";
import cors from "cors";

import twilio from "twilio";
import bodyParser from "body-parser";
const { MessagingResponse } = twilio.twiml;

const app = express();

// const twilio = require("twilio");
// const bodyParser = require("body-parser");
// const MessagingResponse = require("twilio").twiml.MessagingResponse;

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "vaxcare",
});

app.use(express.json());
app.use(cors());

// app.use(
//   bodyParser.json({
//     verify: (req, res, buf) => {
//       req.rawBody = buf;
//     },
//   })
// );

app.post("/message", (req, res) => {
  const { message } = req.body;

  client.messages
    .create({
      body: message,
      from: "+12058756787",
      to: "+639457099101",
    })
    .then((message) => console.log(message.sid))
    .done();
  res.send("Message sent successfully");
});

app.get("/", (req, res) => {
  res.json("Helloo");
});

// Logging in
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  const query = `SELECT * FROM super_admin  WHERE admin_username = ? AND admin_password = ?`;

  db.query(query, [username, password], (error, results) => {
    if (error) {
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    if (results.length > 0) {
      const role = results;
      res.json({ success: true, role: role[0] });
    } else {
      res.status(401).json({ error: "Unauthorized" });
    }
  });
});

app.put("/addchildinfo", (req, res) => {
  const {
    name,
    birthdate,
    sex,
    placeOfBirth,
    address,
    mother,
    father,
    mothersNo,
    fathersNo,
  } = req.body;

  if (
    !name ||
    !birthdate ||
    !sex ||
    !placeOfBirth ||
    !address ||
    !mother ||
    !father
  ) {
    return res.status(400).json({ error: "Please fill in all the fields" });
  }

  const calculateAge = (birthdate) => {
    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  const age = calculateAge(birthdate);
  const status = age >= 1 ? "Completed" : "Underimmunization";

  // Start a transaction
  db.beginTransaction((err) => {
    if (err) {
      console.error("Error starting transaction:", err);
      return res
        .status(500)
        .json({ error: "Internal Server Error", details: err.message });
    }

    // Insert data into child table
    const childQuery =
      "INSERT INTO child (name, date_of_birth, place_of_birth, address, sex, status) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(
      childQuery,
      [name, birthdate, placeOfBirth, address, sex, status],
      (childError, childResults) => {
        if (childError) {
          // Rollback the transaction if there's an error
          console.error("Error updating child details:", childError);
          return db.rollback(() => {
            res.status(500).json({
              error: "Internal Server Error",
              details: childError.message,
            });
          });
        }

        // Get the last inserted child_id
        const lastChildId = childResults.insertId;

        // Insert data into parent table for both mother and father
        const parentQuery =
          "INSERT INTO parent (name, relationship, phoneNo, child_id) VALUES (?, ?, ?, ?)";
        db.query(
          parentQuery,
          [mother, "Mother", mothersNo, lastChildId],
          (motherError) => {
            if (motherError) {
              // Rollback the transaction if there's an error
              console.error("Error updating mother details:", motherError);
              return db.rollback(() => {
                res.status(500).json({
                  error: "Internal Server Error",
                  details: motherError.message,
                });
              });
            }

            // Insert data for the father
            db.query(
              parentQuery,
              [father, "Father", fathersNo, lastChildId],
              (fatherError) => {
                if (fatherError) {
                  // Rollback the transaction if there's an error
                  console.error("Error updating father details:", fatherError);
                  return db.rollback(() => {
                    res.status(500).json({
                      error: "Internal Server Error",
                      details: fatherError.message,
                    });
                  });
                }

                // Commit the transaction if both child and parent updates are successful
                db.commit((commitError) => {
                  if (commitError) {
                    console.error("Error committing transaction:", commitError);
                    return res.status(500).json({
                      error: "Internal Server Error",
                      details: commitError.message,
                    });
                  }

                  res.status(200).json({
                    message: "Child and parent details updated successfully",
                    childRowsAffected: childResults.affectedRows,
                    motherRowsAffected: 1, // Assuming only one row is affected for each parent
                    fatherRowsAffected: 1,
                    reloadPage: true,
                  });
                });
              }
            );
          }
        );
      }
    );
  });
});

app.put("/addchildinfoexistingparent", (req, res) => {
  const { name, birthdate, sex, placeOfBirth, address, mother_id, father_id } =
    req.body;

  if (
    !name ||
    !birthdate ||
    !sex ||
    !placeOfBirth ||
    !address ||
    !mother_id ||
    !father_id
  ) {
    return res.status(400).json({ error: "Please fill in all the fields" });
  }

  // Function to calculate age
  const calculateAge = (birthdate) => {
    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  const age = calculateAge(birthdate);
  const status = age >= 1 ? "Completed" : "Underimmunization";
  const query = `
    INSERT INTO child (name, date_of_birth, sex, place_of_birth, address, mother_id, father_id, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [name, birthdate, sex, placeOfBirth, address, mother_id, father_id, status],
    (err, result) => {
      if (err) {
        console.error("Error inserting child info:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      // Send a success response with the result and a reload flag
      res.status(201).json({
        message: "Child info added successfully",
        result,
        reloadPage: true,
      });
    }
  );
});

// For list of children
app.get("/listofchildren", (req, res) => {
  const query =
    "SELECT child_id, child.date_of_birth, child.name, child.address, " +
    "CAST(SUBSTRING_INDEX(SUBSTRING_INDEX(child.address, ' ', 2), ' ', -1) AS UNSIGNED) AS zone_number, " +
    "CONCAT(IF(TIMESTAMPDIFF(DAY, child.date_of_birth, CURDATE()) <= 365, " +
    "TIMESTAMPDIFF(MONTH, child.date_of_birth, CURDATE()), " +
    "TIMESTAMPDIFF(YEAR, child.date_of_birth, CURDATE())), " +
    "IF(TIMESTAMPDIFF(DAY, child.date_of_birth, CURDATE()) <= 365, ' month/s', ' year/s')) AS age, " +
    "child.sex, child.status FROM child";

  db.query(query, (err, data) => {
    if (err) {
      console.error("Error executing the query:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    return res.json(data);
  });
});

// For bmi tracking
app.get("/activeBMI", (req, res) => {
  const status = "Active";
  // const query =
  //   "SELECT child_id, child.name, child.address, " +
  //   "CAST(SUBSTRING_INDEX(SUBSTRING_INDEX(child.address, ' ', 2), ' ', -1) AS UNSIGNED) AS zone_number, " +
  //   "CONCAT(IF(TIMESTAMPDIFF(DAY, child.date_of_birth, CURDATE()) <= 365, " +
  //   "TIMESTAMPDIFF(MONTH, child.date_of_birth, CURDATE()), " +
  //   "TIMESTAMPDIFF(YEAR, child.date_of_birth, CURDATE())), " +
  //   "IF(TIMESTAMPDIFF(DAY, child.date_of_birth, CURDATE()) <= 365, ' month/s', ' year/s')) AS age, " +
  //   "child.sex, child.status FROM child WHERE child.status = ?";

  const query = `
  SELECT 
  child.child_id, 
  child.name, 
  child.address, 
  CAST(SUBSTRING_INDEX(SUBSTRING_INDEX(child.address, ' ', 2), ' ', -1) AS UNSIGNED) AS zone_number, 
  TIMESTAMPDIFF(MONTH, child.date_of_birth, CURDATE()) AS age_in_months, 
  child.sex, 
  child.status, 
  ht.height, 
  ht.weight 
FROM 
  child 
LEFT JOIN (
  SELECT 
      child_id,
      MAX(ht_date) AS latest_date
  FROM 
      historical_bmi_tracking
  GROUP BY 
      child_id
) AS latest_ht ON child.child_id = latest_ht.child_id
LEFT JOIN 
  historical_bmi_tracking AS ht ON child.child_id = ht.child_id AND latest_ht.latest_date = ht.ht_date
WHERE 
  child.status = "Completed";
  `;

  db.query(query, [status], (err, data) => {
    if (err) {
      console.error("Error executing the query:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    return res.json(data);
  });
});
app.get("/inactiveBMI", (req, res) => {
  const status = "Inactive";
  const query = `
  SELECT 
  child.child_id, 
  child.name, 
  child.address, 
  CAST(SUBSTRING_INDEX(SUBSTRING_INDEX(child.address, ' ', 2), ' ', -1) AS UNSIGNED) AS zone_number, 
  TIMESTAMPDIFF(MONTH, child.date_of_birth, CURDATE()) AS age_in_months, 
  child.sex, 
  child.status, 
  ht.height, 
  ht.weight 
FROM 
  child 
LEFT JOIN (
  SELECT 
      child_id,
      MAX(ht_date) AS latest_date
  FROM 
      historical_bmi_tracking
  GROUP BY 
      child_id
) AS latest_ht ON child.child_id = latest_ht.child_id
LEFT JOIN 
  historical_bmi_tracking AS ht ON child.child_id = ht.child_id AND latest_ht.latest_date = ht.ht_date
WHERE 
  child.status = ?;
  `;
  db.query(query, [status], (err, data) => {
    if (err) {
      console.error("Error executing the query:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    return res.json(data);
  });
});

app.get("/completedBMI", (req, res) => {
  const status = "Completed";
  const query =
    "SELECT child_id, child.name, child.address, CAST(SUBSTRING_INDEX(SUBSTRING_INDEX(child.address, ' ', 2), ' ', -1) AS UNSIGNED) AS zone_number, CONCAT(IF(TIMESTAMPDIFF(DAY, child.date_of_birth, CURDATE()) <= 365, TIMESTAMPDIFF(MONTH, child.date_of_birth, CURDATE()), TIMESTAMPDIFF(YEAR, child.date_of_birth, CURDATE())), IF(TIMESTAMPDIFF(DAY, child.date_of_birth, CURDATE()) <= 365, ' month/s', ' year/s')) AS age, child.sex, child.status FROM child WHERE child.status = ?";
  db.query(query, [status], (err, data) => {
    if (err) {
      console.error("Error executing the query:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    return res.json(data);
  });
});

app.get("/viewbmitracking/:childId", async (req, res) => {
  const childId = req.params.childId;

  const childDetailsQ = `
    SELECT 
    child.child_id, 
    child.name, 
    child.address, 
    DATE_FORMAT(child.date_of_birth, '%M %d, %Y') AS date_of_birth, 
    CONCAT(
      IF(TIMESTAMPDIFF(DAY, child.date_of_birth, CURDATE()) <= 365, 
        TIMESTAMPDIFF(MONTH, child.date_of_birth, CURDATE()), 
        TIMESTAMPDIFF(YEAR, child.date_of_birth, CURDATE())
      ), 
      IF(TIMESTAMPDIFF(DAY, child.date_of_birth, CURDATE()) <= 365, ' month/s', ' year/s')
    ) AS age, 
    child.sex, 
    child.status, 
    child.family_number, 
    child.place_of_birth, 
    child.status, 
    father.parent_id AS father_id,  -- Added father parent_id
    father.name AS father, 
    father.phoneNo AS father_phoneNo, 
    mother.parent_id AS mother_id,  -- Added mother parent_id
    mother.name AS mother, 
    mother.phoneNo AS mother_phoneNo
  FROM 
    child
  LEFT JOIN parent AS father ON child.father_id = father.parent_id 
  LEFT JOIN parent AS mother ON child.mother_id = mother.parent_id
  WHERE 
    child.child_id = ?;
  `;

  const bmiHistoryQ = `SELECT hr.ht_date, hr.height, hr.weight FROM historical_bmi_tracking as hr WHERE hr.child_id = ? ORDER BY hr.ht_date DESC`;
  const historyRecordQ = `SELECT DISTINCT hr.history_date, hr.allergies, hr.temperature, hr.cough, hr.cold FROM history_and_record AS hr INNER JOIN child ON hr.child_id = ? ORDER BY hr.history_date DESC`;
  const result = {
    childDetails: "",
    bmiHistory: "",
    historyRecords: "",
  };

  try {
    result.childDetails = await queryAsync(childDetailsQ, [childId]);
    result.bmiHistory = await queryAsync(bmiHistoryQ, [childId]);
    result.historyRecords = await queryAsync(historyRecordQ, [childId]);

    res.json(result);
  } catch (error) {
    console.error("Error executing the queries:", error);
    res.status(500).json({ error: "Internal Server Error", details: error });
  }
});

// Utility function lang to
const queryAsync = (query, params) => {
  return new Promise((resolve, reject) => {
    db.query(query, params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

app.put("/updateChildDetails", (req, res) => {
  const { name, birthdate, placeofbirth, gender, number, address, childID } =
    req.body;

  let query = "UPDATE child SET ";
  const setClauses = [];

  if (name.length !== 0) setClauses.push(`name = '${name.trim()}'`);
  if (birthdate.length !== 0)
    setClauses.push(`date_of_birth = '${birthdate.trim()}'`);
  if (placeofbirth.length !== 0)
    setClauses.push(`place_of_birth = '${placeofbirth.trim()}'`);
  if (gender.length !== 0) setClauses.push(`sex = '${gender.trim()}'`);
  if (number.length !== 0)
    setClauses.push(`family_number = '${number.trim()}'`);
  if (address.length !== 0) setClauses.push(`address = '${address.trim()}'`);

  const birthdateObj = new Date(birthdate);
  const currentDate = new Date();
  const ageInYears = currentDate.getFullYear() - birthdateObj.getFullYear();

  if (ageInYears <= 1) {
    console.log("The child is at least 1 year old.");
    setClauses.push(`status = 'Underimmunization'`);
  }

  query += setClauses.join(", ");
  query += ` WHERE child_id = '${childID}'`;

  const values = [
    name,
    birthdate,
    placeofbirth,
    gender,
    parseInt(number),
    address,
    childID,
  ];

  db.query(query, values, (error, results) => {
    if (error) {
      console.error("Error updating child details:", error);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.status(200).json({
        message: "Child details updated successfully",
        rowsAffected: results.affectedRows,
        reloadPage: true,
      });
    }
  });
});

app.put("/updateChildDetailsFromImmu", (req, res) => {
  const {
    name,
    birthdate,
    place_of_birth,
    sex,
    address,
    childID,
    mother: motherName,
    mother_phoneNo: motherPhoneNo,
    father: fatherName,
    father_phoneNo: fatherPhoneNo,
    mother_id,
    father_id,
  } = req.body;

  console.log("Received Data:", req.body);

  // Build the query for updating child details
  let childQuery = "UPDATE child SET ";
  const childSetClauses = [];

  if (name) childSetClauses.push(`name = '${name.trim()}'`);
  if (birthdate) childSetClauses.push(`date_of_birth = '${birthdate.trim()}'`);
  if (place_of_birth)
    childSetClauses.push(`place_of_birth = '${place_of_birth.trim()}'`);

  // Add the sex field (gender) to the query
  if (sex) {
    childSetClauses.push(`sex = '${sex.trim()}'`);
  }

  if (address) childSetClauses.push(`address = '${address.trim()}'`);

  // Join the clauses and append to query
  childQuery += childSetClauses.join(", ");
  childQuery += ` WHERE child_id = '${childID}'`;

  console.log("Constructed Child Query:", childQuery);

  // Build the query for updating parent's details using their IDs
  let parentQueries = [];

  if (mother_id && (motherName || motherPhoneNo)) {
    let motherQuery = "UPDATE parent SET ";
    const motherSetClauses = [];
    if (motherName) motherSetClauses.push(`name = '${motherName.trim()}'`);
    if (motherPhoneNo)
      motherSetClauses.push(`phoneNo = '${motherPhoneNo.trim()}'`);
    motherQuery += motherSetClauses.join(", ");
    motherQuery += ` WHERE parent_id = '${mother_id}'`; // Use mother_id in the WHERE clause
    parentQueries.push(motherQuery);
  }

  if (father_id && (fatherName || fatherPhoneNo)) {
    let fatherQuery = "UPDATE parent SET ";
    const fatherSetClauses = [];
    if (fatherName) fatherSetClauses.push(`name = '${fatherName.trim()}'`);
    if (fatherPhoneNo)
      fatherSetClauses.push(`phoneNo = '${fatherPhoneNo.trim()}'`);
    fatherQuery += fatherSetClauses.join(", ");
    fatherQuery += ` WHERE parent_id = '${father_id}'`; // Use father_id in the WHERE clause
    parentQueries.push(fatherQuery);
  }

  console.log("Parent Queries:", parentQueries);

  // Start database transaction
  db.beginTransaction((transactionError) => {
    if (transactionError) {
      console.error("Transaction Error:", transactionError);
      return res.status(500).json({ error: "Transaction Error" });
    }

    // Execute the child update query
    db.query(childQuery, (childError, childResults) => {
      if (childError) {
        return db.rollback(() => {
          console.error("Error updating child details:", childError);
          res.status(500).json({ error: "Failed to update child details" });
        });
      }

      // Execute parent update queries in sequence
      Promise.all(
        parentQueries.map(
          (parentQuery) =>
            new Promise((resolve, reject) => {
              db.query(parentQuery, (parentError, parentResults) => {
                if (parentError) {
                  reject(parentError);
                } else {
                  resolve(parentResults);
                }
              });
            })
        )
      )
        .then(() => {
          // Commit the transaction if all queries succeed
          db.commit((commitError) => {
            if (commitError) {
              return db.rollback(() => {
                console.error("Commit Error:", commitError);
                res.status(500).json({ error: "Failed to commit transaction" });
              });
            }

            res.status(200).json({
              message: "Child and parent details updated successfully",
              reloadPage: true,
            });
          });
        })
        .catch((parentError) => {
          // Rollback transaction if any parent update fails
          db.rollback(() => {
            console.error("Error updating parent details:", parentError);
            res.status(500).json({ error: "Failed to update parent details" });
          });
        });
    });
  });
});

app.get("/viewbmitracking/addbmi/:childId", async (req, res) => {
  const childId = req.params.childId;

  const childDetailsQ = "SELECT * FROM child WHERE child_id = ?";
  const parentQ = "SELECT * FROM parent WHERE parent.child_id = ?";

  const result = {
    childDetails: "",
    parentDetails: "",
  };

  try {
    result.childDetails = await queryAsync(childDetailsQ, [childId]);
    result.parentDetails = await queryAsync(parentQ, [childId]);

    res.json(result);
  } catch (error) {
    console.error("Error executing the queries:", error);
    res.status(500).json({ error: "Internal Server Error", details: error });
  }

  // db.query(query, [childId], (err, data) => {
  //   if (err) {
  //     console.error("Error executing the query:", err);
  //     return res.status(500).json({ error: "Internal Server Error" });
  //   }
  //   return res.json(data);
  // });
});

app.post("/addBMIRecord/:childId", (req, res) => {
  const details = req.body;

  const query = `INSERT INTO historical_bmi_tracking (ht_date, height, weight, child_id) VALUES ( '${details.currentDate}', '${details.height}', '${details.weight}', '${details.childId}')`;

  db.query(query, (err, data) => {
    if (err) {
      console.error("Error executing the query:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    return res.json(data);
  });
});

app.put("/updateParents", (req, res) => {
  const { childID, fathersname, fathersNo, mothersname, mothersNo } = req.body;

  console.log(childID, fathersname, fathersNo, mothersname, mothersNo);

  let query = `
    UPDATE parent
    SET 
      name = 
        CASE 
  `;

  if (fathersname.length !== 0) {
    query += `WHEN relationship = 'Father' THEN '${fathersname}'`;
  }
  if (mothersname.length !== 0) {
    query += `WHEN relationship = 'Mother' THEN '${mothersname}'`;
  }

  query += `
      ELSE name
    END,
    phoneNo = 
      CASE
  `;

  if (fathersNo.length !== 0) {
    query += `WHEN relationship = 'Father' THEN '${fathersNo}'`;
  }
  if (mothersNo.length !== 0) {
    query += `WHEN relationship = 'Mother' THEN '${mothersNo}'`;
  }

  query += `
      ELSE phoneNo
    END
    WHERE child_id = '${childID}'`;

  db.query(query, (error, results) => {
    if (error) {
      console.error("Error updating parent details:", error);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.status(200).json({
        message: "Parent details updated successfully",
        rowsAffected: results.affectedRows,
        reloadPage: true,
      });
    }
  });
});

app.put("/addHistoryAndRecord", (req, res) => {
  const { childId, heartrate, allergies, temperature, coldsValue, coughValue } =
    req.body;

  let query = `INSERT INTO history_and_record (history_date, heart_rate, temperature, cough, cold, allergies, child_id) 
                                         VALUES (NOW(), `;

  const values = [];

  if (heartrate.length !== 0) {
    values.push(`'${heartrate}'`);
  } else {
    values.push("'N/A'");
  }

  if (temperature.length !== 0) {
    values.push(`'${temperature}'`);
  } else {
    values.push("'N/A'");
  }

  if (coughValue.length !== 0) {
    values.push(`'${coughValue}'`);
  } else {
    values.push("'N/A'");
  }

  if (coldsValue.length !== 0) {
    values.push(`'${coldsValue}'`);
  } else {
    values.push("'N/A'");
  }

  if (allergies.length !== 0) {
    values.push(`'${allergies}'`);
  } else {
    values.push("'N/A'");
  }

  if (childId.length !== 0) {
    values.push(`${childId}`);
  }

  query += values.join(", ") + ")";

  db.query(query, (err, data) => {
    if (err) {
      console.error("Error executing the query:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    return res.json(data);
  });
});

app.put("/updateStatusInactive/:childId/:status", (req, res) => {
  const childId = req.params.childId;
  const status = req.params.status;

  const query = `UPDATE child SET status = '${status}' WHERE child_id = '${childId}'`;

  db.query(query, (err, data) => {
    if (err) {
      console.error("Error executing the query:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    return res.json(data);
  });
});

// Immunization

app.get("/getAllCompleted", (req, res) => {
  const completedChilds = `
  SELECT 
    child.child_id, 
    child.name, 
    child.date_of_birth,
    child.address, 
    CAST(SUBSTRING_INDEX(SUBSTRING_INDEX(child.address, ' ', 2), ' ', -1) AS UNSIGNED) AS zone_number, 
    TIMESTAMPDIFF(MONTH, child.date_of_birth, CURDATE()) AS age_in_months, 
    child.sex, 
    child.status 
  FROM 
    child 
  WHERE 
    child.status = "Underimmunization";
  `;

  db.query(completedChilds, (err, data) => {
    if (err) {
      console.error("Error executing the query:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    return res.json(data);
  });
});

app.get("/activeImmu", (req, res) => {
  const status = "Underimmunization";
  const query = `
  SELECT 
    child.child_id, 
    child.name, 
    child.address, 
    CAST(SUBSTRING_INDEX(SUBSTRING_INDEX(child.address, ' ', 2), ' ', -1) AS UNSIGNED) AS zone_number, 
    TIMESTAMPDIFF(MONTH, child.date_of_birth, CURDATE()) AS age_in_months, 
    child.sex, 
    child.status
  FROM 
    child 
  WHERE 
    child.status = ?;
  `;

  db.query(query, [status], (err, data) => {
    if (err) {
      console.error("Error executing the query:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    return res.json(data);
  });
});

app.get("/completedImmu", (req, res) => {
  const status = "Completed";
  const query = `
  SELECT 
    child.child_id, 
    child.name, 
    child.address, 
    CAST(SUBSTRING_INDEX(SUBSTRING_INDEX(child.address, ' ', 2), ' ', -1) AS UNSIGNED) AS zone_number, 
    TIMESTAMPDIFF(MONTH, child.date_of_birth, CURDATE()) AS age_in_months, 
    child.sex, 
    child.status
  FROM 
    child 
  WHERE 
    child.status IN ("Completed", "Active", "Inactive");
  `;

  db.query(query, [status], (err, data) => {
    if (err) {
      console.error("Error executing the query:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    return res.json(data);
  });
});

app.get("/getChildImmunization/:childId", async (req, res) => {
  const childID = req.params.childId;

  const query = `
  SELECT 
    vaccine.name AS vaccine_name, 
    vaccinations.date_administered,
    vaccine.doses_required,
    vaccine.is_deleted
  FROM vaccine
  LEFT JOIN vaccinations ON vaccine.vaccine_id = vaccinations.vaccine_id 
    AND vaccinations.child_id = ?
  WHERE vaccine.is_deleted = 0
  ORDER BY vaccine.vaccine_id ASC;
`;

  try {
    // Execute the query
    const vaccineData = await queryAsync(query, [childID]);

    // Organize the data by vaccine name
    const result = {};
    vaccineData.forEach((vaccine) => {
      if (!result[vaccine.vaccine_name]) {
        result[vaccine.vaccine_name] = {
          dosesRequired: vaccine.doses_required,
          administeredDates: [],
          dosesTaken: 0, // Initialize dosesTaken
        };
      }
      if (vaccine.date_administered) {
        result[vaccine.vaccine_name].administeredDates.push(
          vaccine.date_administered
        );
        result[vaccine.vaccine_name].dosesTaken += 1; // Increment doses taken
      }
    });

    // Send the result
    res.json(result);
  } catch (error) {
    console.error("Error executing the queries:", error);
    res.status(500).json({ error: "Internal Server Error", details: error });
  }
});

app.get("/showRemarks/:childId", async (req, res) => {
  const childID = req.params.childId;

  const BCGVaccineQ = `
  SELECT  vaccinations.remarks
  FROM vaccine 
  INNER JOIN vaccinations ON vaccine.vaccine_id = vaccinations.vaccine_id 
  INNER JOIN child on vaccinations.child_id = child.child_id 
  WHERE child.child_id = ? AND vaccine.name = "BCG Vaccine";
  `;

  const HepatitisBVaccine = `
  SELECT  vaccinations.remarks
  FROM vaccine 
  INNER JOIN vaccinations ON vaccine.vaccine_id = vaccinations.vaccine_id 
  INNER JOIN child on vaccinations.child_id = child.child_id 
  WHERE child.child_id = ? AND vaccine.name = "Hepatitis B Vaccine";
  `;

  const PentavalentVaccineQ = `
  SELECT  vaccinations.remarks
  FROM vaccine 
  INNER JOIN vaccinations ON vaccine.vaccine_id = vaccinations.vaccine_id 
  INNER JOIN child on vaccinations.child_id = child.child_id 
  WHERE child.child_id = ? AND vaccine.name = "Pentavalent Vaccine (DPT-Hep B-HIB)";
  `;

  const OralPolioVaccineQ = `
  SELECT  vaccinations.remarks
  FROM vaccine 
  INNER JOIN vaccinations ON vaccine.vaccine_id = vaccinations.vaccine_id 
  INNER JOIN child on vaccinations.child_id = child.child_id 
  WHERE child.child_id = ? AND vaccine.name = "Oral Polio Vaccine (OPV)";
  `;

  const InactivatedPolioQ = `
  SELECT  vaccinations.remarks
  FROM vaccine 
  INNER JOIN vaccinations ON vaccine.vaccine_id = vaccinations.vaccine_id 
  INNER JOIN child on vaccinations.child_id = child.child_id 
  WHERE child.child_id = ? AND vaccine.name = "Inactivated Polio Vaccine (PIV)";
  `;

  const PneumococcalConjugateQ = `
  SELECT  vaccinations.remarks
  FROM vaccine 
  INNER JOIN vaccinations ON vaccine.vaccine_id = vaccinations.vaccine_id 
  INNER JOIN child on vaccinations.child_id = child.child_id 
  WHERE child.child_id = ? AND vaccine.name = "Pneumococcal Conjugate Vaccine (PCV)";
  `;

  const MeaslesMumpsRubellaQ = `
  SELECT  vaccinations.remarks
  FROM vaccine 
  INNER JOIN vaccinations ON vaccine.vaccine_id = vaccinations.vaccine_id 
  INNER JOIN child on vaccinations.child_id = child.child_id 
  WHERE child.child_id = ? AND vaccine.name = "Measles, Mumps, Rubella Vaccine (MMR)";
  `;

  const result = {
    BCGVaccine: "",
    HepatitisBVaccine: "",
    PentavalentVaccine: "",
    OralPolioVaccine: "",
    InactivatedPolio: "",
    PneumococcalConjugate: "",
    MeaslesMumpsRubella: "",
  };

  try {
    result.BCGVaccine = await queryAsync(BCGVaccineQ, [childID]);
    result.HepatitisBVaccine = await queryAsync(HepatitisBVaccine, [childID]);
    result.PentavalentVaccine = await queryAsync(PentavalentVaccineQ, [
      childID,
    ]);
    result.OralPolioVaccine = await queryAsync(OralPolioVaccineQ, [childID]);
    result.InactivatedPolio = await queryAsync(InactivatedPolioQ, [childID]);
    result.PneumococcalConjugate = await queryAsync(PneumococcalConjugateQ, [
      childID,
    ]);
    result.MeaslesMumpsRubella = await queryAsync(MeaslesMumpsRubellaQ, [
      childID,
    ]);

    res.json(result);
  } catch (error) {
    console.error("Error executing the queries:", error);
    res.status(500).json({ error: "Internal Server Error", details: error });
  }
});

app.put("/updateImmunization", (req, res) => {
  const { childId, selectedVaccineId, date, remarks } = req.body;

  console.log(childId);
  console.log(selectedVaccineId);
  console.log(date);
  console.log(remarks);

  const query = `
  INSERT INTO vaccinations (child_id, vaccine_id, date_administered, remarks) 
  VALUES (?, ?, ?, ?)
  `;

  db.query(
    query,
    [childId, selectedVaccineId, date, remarks],
    (error, results) => {
      if (error) {
        console.error("Error updating child details:", error);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.status(200).json({
          message: "Child details updated successfully",
          rowsAffected: results.affectedRows,
          reloadPage: true,
        });
      }
    }
  );
});

app.get("/dosesTaken/:childId", (req, res) => {
  const childId = req.params.childId;
  const vaccine = req.query.vaccine;

  const query = `
  SELECT (vaccine.doses_required - COUNT(*)) AS dose_left, vaccine.doses_required, COUNT(*) as dose_taken
  FROM vaccinations
  INNER JOIN vaccine ON vaccinations.vaccine_id = vaccine.vaccine_id
  WHERE vaccine.name = ? AND vaccinations.child_id = ?;

  `;
  db.query(query, [vaccine, childId], (err, data) => {
    if (err) {
      console.error("Error executing the query:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    return res.json(data);
  });
});

app.get("/administeredVaccines", (req, res) => {
  const { childId, selectedVaccineId } = req.query;

  console.log(req.query);
  console.log("Child id: ", childId);
  console.log("seleced vaccine id: ", selectedVaccineId);

  const query = `
  SELECT * FROM vaccinations WHERE vaccinations.child_id = ? AND vaccinations.vaccine_id = ?;
  `;
  db.query(query, [childId, selectedVaccineId], (err, data) => {
    if (err) {
      console.error("Error executing the query:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    return res.json([data]);
  });
});

app.get("/admnisteredVaccinesWithId/:childId", async (req, res) => {
  const childId = req.params.childId;

  const query = `
  SELECT
    DATE_FORMAT(vaccinations.date_administered, '%Y-%m-%d') AS date
  FROM
    vaccinations
  INNER JOIN
    vaccine ON vaccinations.vaccine_id = vaccine.vaccine_id
  WHERE
    vaccinations.child_id = ?;
  `;
  db.query(query, [childId], (err, data) => {
    if (err) {
      console.error("Error executing the query:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    return res.json(data);
  });
});

app.put("/updateVaccineDate/:childId", (req, res) => {
  const { childId } = req.params;
  const { vaccineId, oldDate, newDate } = req.body;

  console.log(`child id ${childId}, vaccine id ${vaccineId}`);
  console.log("Date: ", oldDate);
  console.log("Old date: ", newDate);

  // const query = `
  //   SELECT *
  //   FROM vaccinations
  //   INNER JOIN vaccine ON vaccinations.vaccine_id = vaccine.vaccine_id
  //   WHERE vaccinations.child_id = 1 AND vaccinations.date_administered = '2023-05-01'
  //   AND vaccine.vaccine_id = 3
  // `;
  // db.query(query, [childId, selectedVaccineId], (err, data) => {
  //   if (err) {
  //     console.error("Error executing the query:", err);
  //     return res.status(500).json({ error: "Internal Server Error" });
  //   }
  //   return res.json([data]);
  // });
});

// Reminder

app.get("/getAllUnderimmunizaton", (req, res) => {
  const query = "SELECT * FROM child WHERE status = 'Underimmunization'";

  db.query(query, (err, data) => {
    if (err) {
      console.error("Error executing the query:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    return res.json(data);
  });
});

app.get("/getAllReminders", (req, res) => {
  const query = `
  SELECT *, DATE_FORMAT(reminder.dateSend, '%M %e, %Y') AS formattedDate
  FROM reminder
  INNER JOIN child ON reminder.child_id = child.child_id
  ORDER BY reminder.dateSend DESC;
  `;
  db.query(query, (err, data) => {
    if (err) {
      console.error("Error executing the query:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    return res.json(data);
  });
});

app.get("/getAllRemindersWithParent", (req, res) => {
  //   SELECT reminder.*, parent.name as parent, parent.relationship as relationship, child.name as child
  // FROM reminder
  // INNER JOIN (
  //     SELECT parent_id, MAX(reminderId) AS max_reminderId
  //     FROM reminder
  //     GROUP BY parent_id
  // ) AS max_reminders ON reminder.parent_id = max_reminders.parent_id AND reminder.reminderId = max_reminders.max_reminderId
  // INNER JOIN parent on reminder.parent_id = parent.parent_id
  // INNER JOIN child on parent.child_id = child.child_id

  const query = `
  SELECT
  reminder.*,
  parent.name AS parent,
  parent.relationship AS relationship,
  child.name AS child,
  parent.parent_id AS parentID,
  child.child_id as childID
  FROM
  reminder
  INNER JOIN (
  SELECT
      parent_id,
      MAX(reminderId) AS max_reminderId
  FROM
      reminder
  GROUP BY
      parent_id
  ) AS max_reminders ON reminder.parent_id = max_reminders.parent_id AND reminder.reminderId = max_reminders.max_reminderId
  RIGHT JOIN parent ON reminder.parent_id = parent.parent_id
  RIGHT JOIN child ON parent.child_id = child.child_id
  ORDER BY reminder.reminderId IS NULL, reminder.dateSend DESC;
  `;

  db.query(query, (err, data) => {
    if (err) {
      console.error("Error executing the query:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    return res.json(data);
  });
});

app.get("/getChildId/:name", (req, res) => {
  const name = req.params.name;
  const query = `
  SELECT child.name, child.child_id FROM child WHERE child.child_id = ?
  `;

  db.query(query, name, (err, data) => {
    if (err) {
      console.error("Error executing the query:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    return res.json(data);
  });
});

app.put("/insertReminder", async (req, res) => {
  try {
    const { message, currentDate, parentID, childID } = req.body;

    const query = `
      INSERT INTO reminder (message, dateSend, parent_id, child_id) VALUES (?, ?, ?, ?)
    `;

    // Parse the input date and time
    const [datePart, timePart] = currentDate.split(", ");
    const [month, day, year] = datePart.split("/");
    const [hour, minute] = timePart.split(":");

    // Create a formatted date string in the MySQL DATETIME format
    const formattedDateString = `${year}-${month.padStart(
      2,
      "0"
    )}-${day.padStart(2, "0")} ${hour}:${minute}:00`;

    console.log(
      `Message ${message}: Date: ${formattedDateString} ParentID: ${parentID} ChildID: ${childID}`
    );

    const results = await new Promise((resolve, reject) => {
      db.query(
        query,
        [message, formattedDateString, parentID, childID],
        (error, results) => {
          if (error) {
            console.error("Error inserting reminder:", error);
            reject(error);
          } else {
            resolve(results);
          }
        }
      );
    });

    res.status(200).json({
      message: "Reminder inserted successfully",
      rowsAffected: results.affectedRows,
      reloadPage: true,
    });
  } catch (error) {
    console.error("Error in the /insertReminder endpoint:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/deleteReminder/:reminderId", (req, res) => {
  const reminderId = parseInt(req.params.reminderId);

  const query = `
  DELETE FROM reminder WHERE reminder.reminderId = ?
  `;

  db.query(query, reminderId, (error, results) => {
    if (error) {
      console.error("Error deleting child reminder:", error);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.status(200).json({
        message: "Reminder deleted successfully",
        rowsAffected: results.affectedRows,
        reloadPage: true,
      });
    }
  });
});

// admin

app.put("/createAdmin", (req, res) => {
  const { username, password, repassword } = req.body;
  const role = "health worker";
  const centerName = "Cabaruan Health Center";

  const query = `
  INSERT INTO super_admin (admin_username, admin_password, role, center_name) VALUES (?, ?, ?, ?)
  `;

  db.query(query, [username, password, role, centerName], (error, results) => {
    if (error) {
      console.error("Error adding admin", error);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.status(200).json({
        message: "Adding admin successful",
        rowsAffected: results.affectedRows,
        reloadPage: true,
      });
    }
  });
});

app.get("/getUnderImmunization", (req, res) => {
  const query = `
  SELECT COUNT(*) as number FROM child WHERE child.status = "Underimmunization" GROUP BY child.status;
  `;

  db.query(query, (err, data) => {
    if (err) {
      console.error("Error executing the query:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    return res.json(data);
  });
});

app.get("/getCompleted", (req, res) => {
  const query = `
  SELECT * FROM child WHERE child.status = "Active" OR child.status = "Inactive" OR child.status = "Completed";
  `;

  db.query(query, (err, data) => {
    if (err) {
      console.error("Error executing the query:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    return res.json(data);
  });
});

app.get("/getAllChild/:childId", (req, res) => {
  const childId = req.params.childId;

  // Use regular expression to extract the numeric part
  const match = childId.match(/\d+$/);

  // Check if a match is found
  if (match) {
    const extractedDigit = match[0];
    console.log("Extracted Digit:", extractedDigit);

    // Modify the query to filter based on the extracted digit
    const modifiedQuery = `
      SELECT * FROM child WHERE child_id LIKE ?;
    `;

    db.query(modifiedQuery, [`%${extractedDigit}%`], (err, data) => {
      if (err) {
        console.error("Error executing the modified query:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      return res.json(data);
    });
  } else {
    console.log("No digit found in the child_id");
    return res.status(400).json({ error: "Invalid child_id format" });
  }
});

// Manage account
app.get("/allAdmin", (req, res) => {
  const query = "SELECT * FROM super_admin";

  db.query(query, (error, data) => {
    if (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
    return res.json(data);
  });
});

// Delete admin
app.delete("/deleteAdmin/:admin_id", (req, res) => {
  const adminId = req.params.admin_id;
  const query = "DELETE FROM super_admin WHERE admin_id = ?";

  db.query(query, [adminId], (error, result) => {
    if (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Admin not found" });
    }
    return res.json({ message: "Admin deleted successfully", refresh: true });
  });
});

// Update admin/superadmin
app.put("/updateAdmin/:admin_id", (req, res) => {
  const adminId = req.params.admin_id;
  const username = req.body.username;
  const newPassword = req.body.newPassword;
  const query = `
  UPDATE super_admin SET admin_username = ?, admin_password = ? 
  WHERE super_admin.admin_id = ?`;

  db.query(query, [username, newPassword, adminId], (error, result) => {
    if (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Admin not found" });
    }
    return res.json({ message: "Admin updated successfully", refresh: true });
  });
});

app.put("/updateStatus/:child_id", (req, res) => {
  const childId = req.params.child_id;
  const status = req.body.status;

  const query = `
    UPDATE child SET status = ? 
    WHERE child_id = ?`;

  db.query(query, [status, childId], (error, result) => {
    if (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Child not found" });
    }
    return res.json({ message: "Status updated successfully", refresh: true });
  });
});

// Get all messages
app.get("/getAllMessages/:parentId", (req, res) => {
  const query = `SELECT 
    r.reminderId, 
    r.message, 
    r.dateSend, 
    p.name
FROM 
    reminder r
JOIN 
    parent p
ON 
    r.parent_id = p.parent_id
WHERE r.parent_id = ?`;

  const parentId = req.params.parentId;

  db.query(query, parentId, (error, data) => {
    if (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
    return res.json(data);
  });
});

app.get("/getParentName/:parentID", async (req, res) => {
  const parentID = req.params.parentID;

  const query = `SELECT name FROM parent WHERE parent_id = ?`;
  db.query(query, parentID, (error, data) => {
    if (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
    return res.json(data);
  });
});

app.get("/prescribeMedicines/:childId", (req, res) => {
  const query = `
  SELECT vaccine.name, COUNT(vaccinations.child_id) AS occurrence_count
  FROM vaccine
  LEFT JOIN vaccinations ON vaccine.vaccine_id = vaccinations.vaccine_id 
  AND vaccinations.child_id = ?
  GROUP BY vaccine.name;
  `;

  const childId = req.params.childId;

  db.query(query, childId, (error, data) => {
    if (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
    return res.json(data);
  });
});

app.get("/getBmi", (req, res) => {
  const query = `
  SELECT
  child.*,
  ht.weight,
  ht.height,
  ROUND(ht.weight / POW(ht.height / 100, 2), 2) AS bmi,
  CASE
    WHEN (ht.weight / POW(ht.height / 100, 2)) <= 18.4 THEN 'Underweight'
    WHEN (ht.weight / POW(ht.height / 100, 2)) <= 24.9 THEN 'Normal'
    WHEN (ht.weight / POW(ht.height / 100, 2)) <= 29.9 THEN 'Overweight'
    ELSE 'Obese'
  END AS bmi_category
FROM
  child
INNER JOIN historical_bmi_tracking AS ht ON child.child_id = ht.child_id
INNER JOIN (
  SELECT child_id, MAX(ht_date) AS latest_date
  FROM historical_bmi_tracking
  GROUP BY child_id
) AS latest_ht ON ht.child_id = latest_ht.child_id AND ht.ht_date = latest_ht.latest_date;
  `;

  db.query(query, (error, data) => {
    if (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
    return res.json(data);
  });
});

app.delete("/deleteChild/:childId", (req, res) => {
  const childId = req.params.childId;
  const query = "DELETE FROM child WHERE child_id = ?";

  db.query(query, [childId], (error, result) => {
    if (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Child not found" });
    }
    return res.json({ message: "Child deleted successfully", refresh: true });
  });
});

// vaccines
app.get("/getAllVaccines", (req, res) => {
  const query = `SELECT * FROM vaccine WHERE is_deleted = 0`;

  db.query(query, (error, data) => {
    if (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
    return res.json(data);
  });
});
app.post("/addVaccine", (req, res) => {
  const { name, doses_required, recommended_schedule } = req.body;

  const getMaxIdQuery = "SELECT MAX(vaccine_id) AS max_id FROM vaccine";

  db.query(getMaxIdQuery, (error, result) => {
    if (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }

    const newVaccineId = result[0].max_id ? result[0].max_id + 1 : 1;

    const insertQuery = `INSERT INTO vaccine (vaccine_id, name, doses_required, recommended_schedule, is_deleted) VALUES (?, ?, ?, ?, 0)`;

    db.query(
      insertQuery,
      [newVaccineId, name, doses_required, recommended_schedule],
      (error, insertResult) => {
        if (error) {
          return res.status(500).json({ error: "Internal Server Error" });
        }
        return res.json({ success: true, result: insertResult });
      }
    );
  });
});

app.delete("/deleteVaccine/:id", (req, res) => {
  const { id } = req.params;
  const query = `UPDATE vaccine SET is_deleted = 1 WHERE vaccine_id = ?`;

  db.query(query, [id], (error, result) => {
    if (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }

    return res.json({
      success: true,
      message: "Vaccine soft deleted successfully",
    });
  });
});
app.get("/allAccounts", (req, res) => {
  const query = `SELECT p.parent_id ,p.name AS parent_name, 
                p.relationship, 
                p.phoneNo, 
                p.child_id, 
                p.username, 
                p.password
             FROM parent AS p`;

  db.query(query, (error, data) => {
    if (error) {
      console.error("Error fetching data:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    return res.json(data); // Send the data as JSON
  });
});

app.put("/updateCredentials/:parentId", (req, res) => {
  const { parentId } = req.params;
  const { username, password } = req.body;

  // Check if the username already exists (excluding the current parent being updated)
  const checkUsernameQuery = `SELECT * FROM parent WHERE username = ? AND parent_id != ?`;

  console.log(checkUsernameQuery);

  db.query(checkUsernameQuery, [username, parentId], (err, results) => {
    if (err) {
      console.error("Error checking username: ", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length > 0) {
      // Username already exists, return an error
      return res.status(400).json({ error: "Username already exists" });
    }

    // If username doesn't exist, proceed with the update
    const updateQuery = `UPDATE parent SET username = ?, password = ? WHERE parent_id = ?`;
    console.log(updateQuery);

    db.query(updateQuery, [username, password, parentId], (err, result) => {
      if (err) {
        console.error("Error updating credentials: ", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.status(200).json({ message: "Credentials updated successfully" });
    });
  });
});

app.get("/getAllChildOfParent", (req, res) => {
  const { username, password } = req.query;

  if (!username || !password) {
    return res.status(400).send("Username and password are required");
  }

  const query = `
    SELECT 
    c.*, -- Select all columns from Child
    p.parent_id -- Select parent_id from Parent
    FROM 
        Child c
    JOIN 
        Parent p
        ON (c.mother_id = p.parent_id OR c.father_id = p.parent_id)
    WHERE 
        p.username = ?
        AND p.password = ?;
  `;

  db.query(
    query,
    [username, password, username, password],
    (error, children) => {
      if (error) {
        console.error("Error fetching children:", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (children.length === 0) {
        return res.status(404).send("No children found for the given parent");
      }

      return res.json(children); // Send the data as JSON
    }
  );
});

app.get("/getAllParents", (req, res) => {
  const query = `SELECT * FROM parent;`;

  db.query(query, (err, data) => {
    if (err) {
      console.error("Error executing the query:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    return res.json(data);
  });
});

app.listen(8800, () => {
  console.log("Connected to backend");
});
