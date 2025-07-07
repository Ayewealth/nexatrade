import CustomButton from "@/components/reusable/button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetKycDocuments, useUploadKyc } from "@/hooks/auth";
import { AlertCircle, CheckCircle, FileText, Upload, X } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { Label } from "recharts";
import { toast } from "sonner";
interface KYCDocument {
  id?: string | number;
  document_type: string;
  file: File | null;
  uploaded_at?: string;
  status: "not_submitted" | "pending" | "approved" | "rejected";
  preview?: string;
}

const Kyc = () => {
  const [kycDocuments, setKycDocuments] = useState<KYCDocument[]>([
    { document_type: "id_card", file: null, status: "not_submitted" },
    { document_type: "passport", file: null, status: "not_submitted" },
    { document_type: "driving_license", file: null, status: "not_submitted" },
    { document_type: "proof_of_address", file: null, status: "not_submitted" },
  ]);
  const [selectedDocumentType, setSelectedDocumentType] = useState<string>("");

  const kycFileInputRef = useRef<HTMLInputElement | null>(null);

  const { mutateAsync: uploadDocument, isPending: isUploading } =
    useUploadKyc();
  const { data: existingDocuments, isLoading: isLoadingDocuments } =
    useGetKycDocuments();

  const documentTypeOptions = [
    { value: "id_card", label: "ID Card" },
    { value: "passport", label: "Passport" },
    { value: "driving_license", label: "Driving License" },
    { value: "proof_of_address", label: "Proof of Address" },
  ];

  const documentDescriptions = {
    id_card:
      "Upload a clear photo of your government-issued ID card (front and back)",
    passport: "Upload a clear photo of your passport information page",
    driving_license:
      "Upload a clear photo of your driving license (front and back)",
    proof_of_address:
      "Upload a utility bill, bank statement, or official document showing your address",
  };

  // Load existing documents when component mounts
  useEffect(() => {
    if (existingDocuments && Array.isArray(existingDocuments)) {
      setKycDocuments((prev) =>
        prev.map((doc) => {
          const existingDoc = existingDocuments.find(
            (existing: any) => existing.document_type === doc.document_type
          );
          if (existingDoc) {
            return {
              ...doc,
              id: existingDoc.id?.toString(), // Convert number to string
              status: existingDoc.status as
                | "not_submitted"
                | "pending"
                | "approved"
                | "rejected",
              uploaded_at: existingDoc.uploaded_at || undefined,
              preview: existingDoc.document, // Use document field as file URL
            };
          }
          return doc;
        })
      );
    }
  }, [existingDocuments]);

  const handleKycFileSelect = () => {
    if (kycFileInputRef.current) {
      kycFileInputRef.current.click();
    }
  };

  const handleKycFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedDocumentType) {
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        return;
      }

      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "application/pdf",
      ];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Only JPG, PNG, and PDF files are allowed");
        return;
      }

      const preview = URL.createObjectURL(file);
      setKycDocuments((prev) =>
        prev.map((doc) =>
          doc.document_type === selectedDocumentType
            ? { ...doc, file, preview, status: "pending" as const }
            : doc
        )
      );
    }
  };

  const handleKycUpload = async () => {
    const document = kycDocuments.find(
      (doc) => doc.document_type === selectedDocumentType
    );
    if (!document?.file || !selectedDocumentType) return;

    try {
      const formData = new FormData();
      formData.append("document_type", selectedDocumentType);
      formData.append("document", document.file);

      const result = await uploadDocument(formData);

      setKycDocuments((prev) =>
        prev.map((doc) =>
          doc.document_type === selectedDocumentType
            ? {
                ...doc,
                id: result.id,
                status: "pending" as const,
                uploaded_at: result.uploaded_at || new Date().toISOString(),
              }
            : doc
        )
      );
      toast.success("KYC document uploaded successfully");
    } catch (error) {
      console.error(error);

      setKycDocuments((prev) =>
        prev.map((doc) =>
          doc.document_type === selectedDocumentType
            ? { ...doc, status: "rejected" as const }
            : doc
        )
      );

      toast.error("Failed to upload document");
    }
  };

  const removeKycDocument = () => {
    if (!selectedDocumentType) return;
    setKycDocuments((prev) =>
      prev.map((doc) =>
        doc.document_type === selectedDocumentType
          ? {
              ...doc,
              file: null,
              preview: undefined,
              status: "not_submitted" as const,
            }
          : doc
      )
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "not_submitted":
        return (
          <Badge variant="secondary" className="text-xs">
            Not Submitted
          </Badge>
        );
      case "pending":
        return (
          <Badge
            variant="outline"
            className="text-xs text-blue-600 border-blue-600"
          >
            Pending
          </Badge>
        );
      case "approved":
        return (
          <Badge
            variant="default"
            className="text-xs bg-green-600 hover:bg-green-700"
          >
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="destructive" className="text-xs">
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="text-xs">
            Not Submitted
          </Badge>
        );
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "rejected":
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      case "pending":
        return <FileText className="w-4 h-4 text-blue-600" />;
      default:
        return <Upload className="w-4 h-4 text-gray-400" />;
    }
  };

  const selectedDocument = kycDocuments.find(
    (doc) => doc.document_type === selectedDocumentType
  );
  const uploadedDocuments = kycDocuments.filter(
    (doc) => doc.status !== "not_submitted"
  );

  if (isLoadingDocuments) {
    return <div className="text-center py-8">Loading documents...</div>;
  }

  return (
    <>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">KYC Verification</h3>
        <p className="text-sm text-muted-foreground">
          Select a verification method and upload your document. All documents
          should be clear, readable, and valid.
        </p>
      </div>

      {/* Previously Uploaded Documents */}
      {uploadedDocuments.length > 0 && (
        <Card className="my-6">
          <CardHeader className="">
            <CardTitle className="text-base">
              Previously Uploaded Documents
            </CardTitle>
            <CardDescription className="text-xs">
              Your document verification status
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {uploadedDocuments.map((doc) => (
                <div
                  key={doc.document_type}
                  className="flex items-center justify-between p-2 bg-input rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    {getStatusIcon(doc.status)}
                    <span className="text-sm font-medium">
                      {
                        documentTypeOptions.find(
                          (opt) => opt.value === doc.document_type
                        )?.label
                      }
                    </span>
                  </div>
                  {getStatusBadge(doc.status)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Document Type Selection */}
      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          <Label className="text-sm font-medium">
            Select Verification Method
          </Label>
          <Select
            value={selectedDocumentType}
            onValueChange={setSelectedDocumentType}
          >
            <SelectTrigger className="bg-input border-0 w-full">
              <SelectValue placeholder="Choose a document type to upload" />
            </SelectTrigger>
            <SelectContent>
              {documentTypeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Upload Interface for Selected Document */}
        {selectedDocumentType && selectedDocument && (
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(selectedDocument.status)}
                  <div>
                    <CardTitle className="text-base">
                      {
                        documentTypeOptions.find(
                          (opt) => opt.value === selectedDocumentType
                        )?.label
                      }
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {
                        documentDescriptions[
                          selectedDocumentType as keyof typeof documentDescriptions
                        ]
                      }
                    </CardDescription>
                  </div>
                </div>
                {getStatusBadge(selectedDocument.status)}
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              {selectedDocument.preview ? (
                <div className="space-y-4">
                  <div className="relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
                    <Image
                      src={selectedDocument.preview || "/placeholder.svg"}
                      alt={`${selectedDocumentType} preview`}
                      fill
                      className="object-cover"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 h-6 w-6 p-0"
                      onClick={removeKycDocument}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-2 md:flex-row flex-col">
                    {selectedDocument.status === "pending" && (
                      <CustomButton
                        text={isUploading ? "Uploading..." : "Submit Document"}
                        loading={isUploading}
                        className="bg-gradient-to-r from-[#fccd4d] to-[#f8b500] hover:from-[#f8b500] hover:to-[#fccd4d] rounded-md md:w-fit w-full"
                        onClick={handleKycUpload}
                        isDisabled={isUploading}
                      />
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleKycFileSelect}
                      className="text-sm w-full md:w-fit"
                    >
                      Replace Document
                    </Button>
                  </div>
                </div>
              ) : (
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
                  onClick={handleKycFileSelect}
                >
                  <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600 mb-1">
                    Click to upload document
                  </p>
                  <p className="text-xs text-gray-400">
                    PNG, JPG, PDF up to 10MB
                  </p>
                </div>
              )}

              <input
                type="file"
                accept="image/*,.pdf"
                className="hidden"
                ref={kycFileInputRef}
                onChange={handleKycFileChange}
                multiple={true}
              />
            </CardContent>
          </Card>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-medium text-blue-900 mb-1">Important Notes:</p>
            <ul className="text-blue-800 space-y-1 text-xs">
              <li>• Ensure all documents are clear and readable</li>
              <li>• Documents should be valid and not expired</li>
              <li>• Personal information should match your account details</li>
              <li>• Processing typically takes 1-3 business days</li>
              <li>
                • After your document has been submitted, it will go through
                verification before your status ge&apos;s updated.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Kyc;
