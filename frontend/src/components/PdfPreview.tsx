// export const PdfPreview = ({
//   pdfFile,
//   generatedOutput,
//   onReplaceFile,
// }: PdfPreviewProps) => {
//   if (generatedOutput) {
//     return (
//       <div className="h-[600px] bg-white rounded-lg shadow-sm p-6">
//         <div className="flex justify-between items-center mb-4">
//           <p className="text-lg font-medium">Generated Output</p>
//           <button
//             className="text-sm text-blue-600 hover:text-blue-800"
//             onClick={onReplaceFile}
//           >
//             Replace File
//           </button>
//         </div>
//         <p className="text-sm text-gray-500">Output based on your request:</p>
//         <div className="mt-4 bg-gray-100 p-4 rounded-md">
//           <p>{generatedOutput}</p>
//         </div>
//       </div>
//     );
//   }

//   if (!pdfFile) {
//     return (
//       <div className="h-[600px] bg-white rounded-lg shadow-sm flex items-center justify-center">
//         <p className="text-gray-500">No PDF uploaded yet</p>
//       </div>
//     );
//   }

//   return (
//     <div className="h-[600px] bg-white rounded-lg shadow-sm p-6">
//       <div className="flex justify-between items-center mb-4">
//         <p className="text-lg font-medium">Uploaded File:</p>
//         <button
//           className="text-sm text-blue-600 hover:text-blue-800"
//           onClick={onReplaceFile}
//         >
//           Replace File
//         </button>
//       </div>
//       <p className="text-sm text-gray-500">{pdfFile.name}</p>
//     </div>
//   );
// };
