import enum

class StatusEnum(enum.Enum):
    pending = "pending"
    in_progress = "in_progress"
    resolved = "resolved"
    rejected = "rejected"