/**
  Lumia Online (https://github.com/lumiaonline)
  Copyright (C) 2023 Lumia Online

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/
// Author https://github.com/lucasig11

/// Thin Anchor wrapper over [mpl_token_metadata] program.
use anchor_lang::prelude::*;
use mpl_token_metadata::state;

#[derive(Clone)]
/// Wrapper for the [mpl_token_metadata] program.
pub struct TokenMetadata;

impl Id for TokenMetadata {
    fn id() -> Pubkey {
        mpl_token_metadata::ID
    }
}

#[derive(Clone)]
/// Wrapper for [mpl_token_metadata::state::Metadata] account.
pub struct MetadataAccount(state::Metadata);

impl MetadataAccount {
    pub const LEN: usize = state::MAX_METADATA_LEN;
}

impl AccountDeserialize for MetadataAccount {
    fn try_deserialize_unchecked(buf: &mut &[u8]) -> Result<Self> {
        state::Metadata
            ::deserialize(buf)
            .map_err(|_| ErrorCode::AccountDidNotDeserialize.into())
            .map(MetadataAccount)
    }
}

impl AccountSerialize for MetadataAccount {}

impl Owner for MetadataAccount {
    fn owner() -> Pubkey {
        TokenMetadata::id()
    }
}

impl std::ops::Deref for MetadataAccount {
    type Target = state::Metadata;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}