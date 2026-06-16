import { StyleSheet } from "@react-pdf/renderer";

export const PAGE = {
  width: 595.28,
  height: 841.89,
  padding: 36,
};

export const pdfStyles = StyleSheet.create({
  page: {
    padding: PAGE.padding,
    fontFamily: "Helvetica",
    fontSize: 9,
    color: "#2d3748",
    backgroundColor: "#ffffff",
  },
  dotPage: {
    padding: PAGE.padding,
    fontFamily: "Helvetica",
    fontSize: 9,
    color: "#2d3748",
    backgroundColor: "#fafafa",
  },
  title: {
    fontFamily: "Times-Bold",
    fontSize: 22,
    color: "#1a2f4b",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 10,
    color: "#6b7c93",
    textAlign: "center",
    marginTop: 4,
  },
  label: {
    fontFamily: "Times-Bold",
    fontSize: 8,
    color: "#c4785a",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  value: {
    fontFamily: "Times-Roman",
    fontSize: 9,
    color: "#1a2f4b",
    marginBottom: 3,
  },
  tableHeader: {
    fontFamily: "Helvetica-Bold",
    fontSize: 7,
    textTransform: "uppercase",
    color: "#1a2f4b",
    borderBottomWidth: 1,
    borderBottomColor: "#1a2f4b",
    paddingBottom: 3,
    marginBottom: 4,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#e5e0d8",
    paddingVertical: 3,
    alignItems: "center",
  },
  tableCell: {
    fontSize: 7.5,
    paddingRight: 4,
  },
  emptyCell: {
    fontSize: 7.5,
    color: "#b0b8c4",
  },
  quote: {
    fontFamily: "Times-Italic",
    fontSize: 10,
    color: "#1a2f4b",
    textAlign: "center",
    lineHeight: 1.4,
  },
  magazineLetter: {
    fontFamily: "Helvetica-Bold",
    fontSize: 18,
    color: "#ffffff",
    backgroundColor: "#1a2f4b",
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginHorizontal: 1,
  },
});

export const STAR_YELLOW = "#F5C518";
