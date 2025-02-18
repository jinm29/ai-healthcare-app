import {UpstageDocumentParser} from "@/lib/health-data/parser/document/upstage";
import {DoclingDocumentParser} from "@/lib/health-data/parser/document/docling";

const documents = [
    new UpstageDocumentParser(),
    new DoclingDocumentParser(),
].filter(d => d.enabled)

export default documents
