from pymilvus import Function, FunctionType, MilvusClient, CollectionSchema, FieldSchema, DataType, IndexType, Collection
from app.schemas.common_config import ConfigParams
from typing import List
from langchain_core.documents import Document
from app.schemas.chunk import LangChainChunk
from app.schemas.embedding import LangChainEmbedding
from app.schemas.store import LangChainStore, StoreMetaData
import numpy as np

class MilvusStorer:
    def __init__(self, config: ConfigParams, collection_name: str):
        self.config = config
        self.client = MilvusClient("./milvus.db")
        self.collection_name = collection_name

    def delete_collection(self):
        self.client.drop_collection(self.collection_name)

    def create_collection(self):
        schema = CollectionSchema(
            fields=[
                FieldSchema(name="id", dtype=DataType.INT64, is_primary=True, auto_id=True),
                FieldSchema(name="content", dtype=DataType.VARCHAR, enable_analyzer=True, max_length=1024, description="Store content"),
                FieldSchema(name="metadata", dtype=DataType.JSON, description="Store metadata"),
                FieldSchema(name="vector", dtype=DataType.FLOAT_VECTOR, dim=1024, description="Store vector"),
                # FieldSchema(name="spare", dtype=DataType.SPARSE_FLOAT_VECTOR, description="Store spare"),
            ],
            description="Store collection",
        )
        # bm25_function = Function(
        #     name="bm25",
        #     input_field_names=["content"],
        #     output_field_names=["spare"],
        #     description="BM25 function",
        #     function_type=FunctionType.BM25,
        # )
        # schema.add_function(bm25_function)

        index_params = self.client.prepare_index_params()
        # index_params.add_index(
        #     field_name="spare",
        #     index_type="SPARSE_INVERTED_INDEX",
        #     metric_type="BM25",
        #     params = {
        #         "inverted_index_algo":"DAAT_MAXSCORE",
        #         "bm25_k1":1.2,
        #         "bm25_b":0.75,
        #     }
        # )
        index_params.add_index(
            field_name="vector",
            index_type="IVF_FLAT",
            metric_type="IP",
            params = {
                "nlist": 1024,
            }
        )
        self.client.create_collection(self.collection_name, schema=schema, index_params=index_params)

    def insert(self, chunks: List[LangChainChunk], embedding: List[LangChainEmbedding]) ->List[LangChainStore]:
        datas = []
        for chunk, embd in zip(chunks, embedding):
            data = {
                "content": chunk.page_content,
                "metadata": chunk.metadata.model_dump(),
                "vector": embd.embedding,
            }
            datas.append(data)

        self.client.insert(collection_name=self.collection_name, data=datas)
        return [LangChainStore(content="",
                               metadata=StoreMetaData.model_validate(chunk.metadata.model_dump()))
                                        for chunk in chunks]

    def search(self, query: str) -> str:
        embd = np.random.rand(1024).tolist()
        result = self.client.search(
            collection_name=self.collection_name,
            anns_field="vector",
            data=[embd],
            limit=1,
            output_fields=["content"],
            search_params={"metric_type": "IP"},
        )
        # import pdb;pdb.set_trace()
        # [[]]
        if result == [[]]:
            return "not found"
        else:
            return result[0][0]["content"]

    def query(self, query: str) -> str:
        result = self.client.query(
            collection_name=self.collection_name,
            filter="",
            output_fields=["content"],
            limit=1,
        )
        return result[0]["content"]