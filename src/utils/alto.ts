
export const getStringsFromLine = (textLine: any): string[] | string => {
	if (textLine?.String) {
		if (Array.isArray(textLine.String)) {
			return textLine.String.map((s: any) => s["@_CONTENT"].toString())
		} else {
			return textLine.String["@_CONTENT"].toString()
		}
	}
	return ""
}
