"""Initial Today Gift backend schema.

Revision ID: 20260526_0001
Revises:
Create Date: 2026-05-26
"""
from __future__ import annotations

from alembic import op
import sqlalchemy as sa


revision = "20260526_0001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("google_sub", sa.String(length=255), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("profile_image_url", sa.String(length=1024), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_users_google_sub"), "users", ["google_sub"], unique=True)
    op.create_index(op.f("ix_users_email"), "users", ["email"], unique=True)

    op.create_table(
        "gift_items",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("category", sa.String(length=100), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("min_price", sa.Integer(), nullable=False),
        sa.Column("max_price", sa.Integer(), nullable=False),
        sa.Column("tags_json", sa.JSON(), nullable=False),
        sa.Column("suitable_relations_json", sa.JSON(), nullable=False),
        sa.Column("suitable_occasions_json", sa.JSON(), nullable=False),
        sa.Column("suitable_personality_json", sa.JSON(), nullable=False),
        sa.Column("active", sa.Boolean(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_gift_items_name"), "gift_items", ["name"], unique=True)
    op.create_index(op.f("ix_gift_items_category"), "gift_items", ["category"], unique=False)
    op.create_index(op.f("ix_gift_items_active"), "gift_items", ["active"], unique=False)

    op.create_table(
        "recommendation_requests",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("relationship", sa.String(length=50), nullable=False),
        sa.Column("gender", sa.String(length=50), nullable=False),
        sa.Column("age_group", sa.String(length=50), nullable=False),
        sa.Column("mbti", sa.String(length=20), nullable=False),
        sa.Column("personality_json", sa.JSON(), nullable=False),
        sa.Column("hobbies_json", sa.JSON(), nullable=False),
        sa.Column("budget_min", sa.Integer(), nullable=False),
        sa.Column("budget_max", sa.Integer(), nullable=False),
        sa.Column("budget_range", sa.String(length=50), nullable=False),
        sa.Column("occasion", sa.String(length=50), nullable=False),
        sa.Column("gift_tone", sa.String(length=50), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        op.f("ix_recommendation_requests_user_id"),
        "recommendation_requests",
        ["user_id"],
        unique=False,
    )

    op.create_table(
        "recommendation_results",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("request_id", sa.Integer(), nullable=False),
        sa.Column("ai_model", sa.String(length=100), nullable=False),
        sa.Column("result_json", sa.JSON(), nullable=False),
        sa.Column("candidate_snapshot_json", sa.JSON(), nullable=False),
        sa.Column("status", sa.String(length=50), nullable=False),
        sa.Column("error_message", sa.Text(), nullable=True),
        sa.Column("latency_ms", sa.Integer(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(["request_id"], ["recommendation_requests.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        op.f("ix_recommendation_results_request_id"),
        "recommendation_results",
        ["request_id"],
        unique=True,
    )
    op.create_index(
        op.f("ix_recommendation_results_status"),
        "recommendation_results",
        ["status"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_index(op.f("ix_recommendation_results_status"), table_name="recommendation_results")
    op.drop_index(op.f("ix_recommendation_results_request_id"), table_name="recommendation_results")
    op.drop_table("recommendation_results")
    op.drop_index(op.f("ix_recommendation_requests_user_id"), table_name="recommendation_requests")
    op.drop_table("recommendation_requests")
    op.drop_index(op.f("ix_gift_items_active"), table_name="gift_items")
    op.drop_index(op.f("ix_gift_items_category"), table_name="gift_items")
    op.drop_index(op.f("ix_gift_items_name"), table_name="gift_items")
    op.drop_table("gift_items")
    op.drop_index(op.f("ix_users_email"), table_name="users")
    op.drop_index(op.f("ix_users_google_sub"), table_name="users")
    op.drop_table("users")
