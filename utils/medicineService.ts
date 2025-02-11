import { Medicine } from "@/types/global";
import { api } from "./api";
import { LASAAnalysisResponse } from "@/types/global";

type TokenId = {
  token: string;
  id: string;
};

interface UpdateMedicinePayload {
  // AuthKeyCompany: string;
  Datetime: string;
  // UserID: string;
  // sessionID: string;
  ProductName?: string;
  Category?: string;
  IntakeMethod?: string;
  Manufacturer?: string;
  ManufacturingCountry?: string;
  CountryRegistration?: string;
  CatNumber?: string;
  Barcode?: string;
  TypePackaging?: string;
}

interface UpdateStatusPayload {
  // AuthKeyCompany: string;
  Datetime: string;
  // UserID: string;
  // sessionID: string;
  Status: "pending" | "approved" | "completed";
}

// Маппинг полей нашей модели к полям API
const fieldMapping = {
  product_name: ["ProductName"],
  category: ["Category"],
  intake_method: ["IntakeMethod"],
  manufacturer: ["Manufacturer"],
  manufacturing_country: ["ManufacturingCountry"],
  country_registration: ["CountryRegistration"],
  barcode: ["CatNumber", "Barcode"],
  type_packaging: ["TypePackaging"],
} as const;

export const medicineService = {
  getMedicineByStatus: ({
    status,
    token,
  }: {
    status: string;
    token: string;
  }) => {
    console.log(`[Medicine Service] Fetching medicines with status: ${status}`);
    return api
      .get<Array<Medicine>>(`/medicines/${status}?jwt_token=${token}`)
      .then((response) => {
        console.log(
          `[Medicine Service] Successfully fetched ${response.data.length} medicines with status: ${status}`
        );
        return response;
      })
      .catch((error) => {
        console.error(
          `[Medicine Service] Error fetching medicines with status ${status}:`,
          error
        );
        throw error;
      });
  },

  getMedicineByName: ({ name, token }: { name: string; token: string }) => {
    console.log(`[Medicine Service] Fetching medicine with name: ${name}`);
    return api
      .get<Medicine>(`/medicine/${encodeURIComponent(name)}?jwt_token=${token}`)
      .then((response) => {
        console.log(
          `[Medicine Service] Successfully fetched medicine: ${name}`
        );
        return response;
      })
      .catch((error) => {
        console.error(
          `[Medicine Service] Error fetching medicine ${name}:`,
          error
        );
        throw error;
      });
  },

  updateMedicine: ({
    medicine,
    token,
    originalMedicine,
  }: {
    medicine: Medicine;
    token: string;
    originalMedicine: Medicine;
  }) => {
    console.log(
      `[Medicine Service] Updating medicine: ${medicine.product_name}`
    );
    const payload: UpdateMedicinePayload = {
      // AuthKeyCompany: "string",
      Datetime: new Date().toISOString(),
      // UserID: "string",
      // sessionID: "string",
    };

    // Проверяем каждое поле на изменения
    Object.entries(fieldMapping).forEach(([medicineField, apiFields]) => {
      if (
        medicine[medicineField as keyof Medicine] !==
        originalMedicine[medicineField as keyof Medicine]
      ) {
        apiFields.forEach((apiField) => {
          if (apiField === "CatNumber" || apiField === "Barcode") {
            payload[apiField] = medicine.barcode || "";
          } else {
            payload[apiField] =
              (medicine[medicineField as keyof Medicine] as string) || "";
          }
        });
      }
    });

    console.log(`[Medicine Service] Update payload:`, payload);
    console.log(`[Medicine Service] Using token:`, token);

    return api
      .put<Record<string, boolean>>(
        `/metadata/${medicine.metadata_id}?jwt_token=${token}`,
        payload
      )
      .then((response) => {
        console.log(
          `[Medicine Service] Successfully updated medicine: ${medicine.product_name}`
        );
        return response;
      })
      .catch((error) => {
        console.error(
          `[Medicine Service] Error updating medicine ${medicine.product_name}:`,
          error
        );
        throw error;
      });
  },

  updateMedicineStatus: ({
    medicine,
    token,
    newStatus,
  }: {
    medicine: Medicine;
    token: string;
    newStatus: "pending" | "approved" | "completed";
  }) => {
    console.log(
      `[Medicine Service] Updating status for medicine: ${medicine.product_name} to ${newStatus}`
    );
    const payload: UpdateStatusPayload = {
      // AuthKeyCompany: "string",
      Datetime: new Date().toISOString(),
      // UserID: "string",
      // sessionID: "string",
      Status: newStatus,
    };

    console.log(`[Medicine Service] Status update payload:`, payload);

    return api
      .put<Record<string, boolean>>(
        `/metadata/${medicine.metadata_id}?jwt_token=${token}`,
        payload
      )
      .then((response) => {
        console.log(
          `[Medicine Service] Successfully updated status for medicine: ${medicine.product_name} to ${newStatus}`
        );
        return response;
      })
      .catch((error) => {
        console.error(
          `[Medicine Service] Error updating status for medicine ${medicine.product_name}:`,
          error
        );
        throw error;
      });
  },

  getLASAAnalysis: ({
    responseId,
    token,
  }: {
    responseId: string;
    token: string;
  }) => {
    console.log(
      `[Medicine Service] Fetching LASA analysis for response ID: ${responseId}`
    );
    return api
      .post<LASAAnalysisResponse>(
        `/find_similar/${responseId}?jwt_token=${token}`
      )
      .then((response) => {
        console.log(
          `[Medicine Service] Successfully fetched LASA analysis for response ID: ${responseId}`
        );
        return response;
      })
      .catch((error) => {
        console.error(
          `[Medicine Service] Error fetching LASA analysis for response ID ${responseId}:`,
          error
        );
        // Трансформируем ошибку в нужный формат
        const transformedError = {
          ...error,
          response: {
            ...error.response,
            data: {
              detail:
                error.response?.data?.detail ||
                error.message ||
                (error.response?.status === 405
                  ? "Method not allowed"
                  : "Failed to load LASA analysis"),
            },
          },
        };
        throw transformedError;
      });
  },
  //   getCurrentUser: ({ token, id }: TokenId) =>
  //     api.get<UserNoPass>(`/users?id=${id}&jwt_token=${token}`),
  //   //   Path to be changed
  //   deleteCurrentUser: ({ token, id }: TokenId) =>
  //     api.delete(`/users/${id}?jwt_token=${token}`),
  //   updateCurrentUser: ({ token, id }: TokenId, credentials: UserNoPass) =>
  //     api.put(`/users/${id}?jwt_token=${token}`, credentials),
};

// /users/sdsdsd?jwt_token=sddsds'
