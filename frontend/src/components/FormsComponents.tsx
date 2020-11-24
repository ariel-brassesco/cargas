import React, { FC, useState, ReactElement } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudUploadAlt } from "@fortawesome/free-solid-svg-icons";

type Props = {
  label?: string;
  children: ReactElement;
  onChange: (values: any) => void;
};

export const FileField: FC<Props | any> = ({
  onChange,
  children,
  label,
  ...props
}) => {
  const [file, setFile] = useState<File | undefined>();

  return (
    <div className="field">
      <div className="file is-warning is-boxed is-fullwidth has-text-centered">
        <label className="file-label">
          <input
            type="file"
            className="file-input"
            onChange={(e) => {
              setFile(e.target.files![0]);
              onChange(e.target.files![0]);
            }}
            {...props}
          />
          {file && children ? (
            <children.type {...children.props} file={file} />
          ) : (
            <span className="file-cta">
              <span className="file-icon">
                <FontAwesomeIcon icon={faCloudUploadAlt} />
              </span>
              {label ? <span className="file-label">{label}</span> : null}
              {/* {touched[field.name] && errors[field.name] ? (
                            <p className="help is-danger">{errors[field.name]}</p>
                        ) : null} */}
            </span>
          )}
        </label>
      </div>
    </div>
  );
};
