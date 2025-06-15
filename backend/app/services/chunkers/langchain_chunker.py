from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_text_splitters import CharacterTextSplitter

GAME_CODE = """

"""

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,  # 每个块的大小
    chunk_overlap=00,  # 相邻块之间的重叠大小
    # separators=["\n\n", "\n", " ", ""]  # 分割符列表
)

# 执行分块
text_chunks = text_splitter.create_documents([GAME_CODE])
chunks = text_splitter.split_documents(text_chunks)

print(chunks)